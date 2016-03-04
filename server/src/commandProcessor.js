const
  util = require('util'),
  Immutable = require('immutable'),
  log = require('loglevel'),
  uuid = require('node-uuid').v4,
  commandSchemaValidator = require('./commandSchemaValidator');

const LOGGER = log.getLogger('commandProcessor');

module.exports = commandProcessorFactory;

/**
 * wrapped in a factory function. Separates the gathering of the handler from the processing logic.
 * Also allows us to pass in custom list of handlers during test.
 *
 * @param {object} commandHandlers
 * @param {object} eventHandlers
 * @param {object} store
 * @returns {function} the processCommand function
 */
function commandProcessorFactory(commandHandlers, eventHandlers, store) {

  /**
   *  The command processor handles incoming commands.
   *  For every command the following steps are done.
   *
   *  1. Validation
   *  2. Get command handler
   *  3. Load room
   *  4. Precondition check
   *  5. Handle Command
   *  6. Apply events
   *  7. Store room
   *
   *  Every step can throw an error which will lead to a command rejection event.
   *
   *  @param {object} command
   *  @param {string} userId The id of the user that sent the command. if command is "joinRoom" user id is not yet given and will be undefined!
   *  @returns {object[]} List of events that were produced by this command. (they are already applied to the room state)
   */
  return function processCommand(command, userId) {
    LOGGER.debug(command);

    const context = {
      userId: userId
    };

    // TODO: this might get asynchronous sometime...
    // e.g. when store gets persistent -> asynchronous cache/db access?
    validate(command);
    getCommandHandler(context, command);
    getRoom(context, command);
    preConditions(context, command);
    handle(context, command);
    applyEvents(context, command);
    saveRoomBackToStore(context, command);

    return context.eventsToSend;
  };

  /** 1. Validate incoming command (syntactically, against schema) **/
  function validate(cmd) {
    commandSchemaValidator(cmd);
  }

  /**
   * 2. Find command handler that matches the name of the command.
   */
  function getCommandHandler(ctx, cmd) {
    const handler = commandHandlers[cmd.name];
    if (!handler) {
      throw new Error('No handler found for ' + cmd.name);
    }
    ctx.handler = handler;
  }

  /**
   * 3. Get Room object by command.roomId (currently in-memory store only).
   * For some commands it is valid that the room does not yet exist in the store.
   * Command handlers define whether they expect an existing room or not
   */
  function getRoom(ctx, cmd) {
    ctx.room = store.getRoomById(cmd.roomId);

    if (!ctx.room && ctx.handler.existingRoom) {
      // if no room with this id is in the store but the commandHandler defines "existingRoom=true"
      throw new Error('Command ' + cmd.name + ' only want\'s to get handled for an existing room. (' + cmd.roomId + ')');
    }

    if (!ctx.room) {
      // make sure that command handlers always receive a room object
      ctx.room = new Immutable.Map();
    }
  }

  /**
   * 4. Run command preconditions which are defined in commandHandlers.
   * Preconditions receive the room, the command and the userId and can do some semantic checks.
   */
  function preConditions(ctx, cmd) {
    if (!ctx.handler.preCondition) {
      return;
    }
    try {
      ctx.handler.preCondition(ctx.room, cmd, ctx.userId);
    } catch (pcError) {
      throw new PreconditionError(pcError, cmd);
    }
  }

  /**
   *  5. Handle the command by invoking the handler function.
   *  The handler function receives the room and the command.
   *  The handler function decides which events are produced.
   */
  function handle(ctx, cmd) {
    ctx.eventHandlingQueue = [];
    ctx.eventsToSend = [];

    /**
     * called from command handlers: room.apply('someEvent', payload)
     * @param eventName
     * @param eventPayload
     */
    ctx.room.applyEvent = function applyEvent(eventName, eventPayload) {
      const eventHandler = eventHandlers[eventName];
      if (!eventHandler) {
        throw new Error('Cannot apply unknown event ' + eventName);
      }

      ctx.eventHandlingQueue.push(currentRoom => {
        const updatedRoom = eventHandler(currentRoom, eventPayload);

        // construct the event object that is sent back to clients
        ctx.eventsToSend.push({
          id: uuid(),
          userId: ctx.userId, // which user triggered the command / is "responsible" for the event
          correlationId: cmd.id,
          name: eventName,
          roomId: updatedRoom.get('id'),
          payload: eventPayload
        });

        return updatedRoom;
      });

    };

    // invoke the command handler function (will produce events by calling "applyEvent")
    ctx.handler.fn(ctx.room, cmd);
  }

  /**
   * 6. Apply events to the room.
   * Events modify the room state.
   * All produced events are applied in-order.
   */
  function applyEvents(ctx) {
    ctx.eventHandlingQueue.forEach(evtHandler => ctx.room = evtHandler(ctx.room));
  }

  /**
   *  7. Store modified room object
   *  Command was processed successfully and all produced events were applied and modified the room object.
   *  Now store the new state.
   */
  function saveRoomBackToStore(ctx) {
    // TODO: can eventHandlers "delete" the room? then ctx.room would be undefined here?
    store.saveRoom(ctx.room);
  }

}

function PreconditionError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = 'Precondition Error during "' + cmd.name + '": ' + err.message;
}
util.inherits(PreconditionError, Error);
