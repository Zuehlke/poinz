var
  util = require('util'),
  Immutable = require('immutable'),
  log = require('loglevel'),
  uuid = require('node-uuid').v4,
  commandSchemaValidator = require('./commandSchemaValidator'),
  roomStore = require('./roomsStore');

var LOGGER = log.getLogger('commandProcessor');

module.exports = commandProcessorFactory;

function commandProcessorFactory(commandHandlers, eventHandlers) {

  /**
   *  The command processor handles incoming commands.
   *  For every command the following steps are done.
   *
   *  1. Validate incoming command (syntactically, against schema)
   *  2. Find command handler (for command.name)
   *  3. Get Room object by command.roomId (currently in-memory store only)
   *  4. Run command preconditions (defined in commandHandler)
   *  5. Handle the command (command handler decides which events are produced)
   *  6. Apply events (events modify the room)
   *  7. Store modified room object
   *
   *  Every step can throw an error which will lead to a command rejection event.
   *
   *  @param {object} command
   *  @param {string} userId The id of the user that sent the command. if command is "joinRoom" user id is not yet given and will be undefined!
   */
  return function processCommand(command, userId) {

    LOGGER.debug(command);

    // TODO: this might get asynchronous sometime...
    // e.g. when roomStore gets persistent -> asynchronous cache/db access?
    var queue = [
      commandSchemaValidator,
      function getCommandHandler(cmd, ctx) {
        var handler = commandHandlers[cmd.name];
        if (!handler) {
          throw new Error('No handler found for ' + cmd.name);
        }
        ctx.handler = handler;
      },
      function getRoom(cmd, ctx) {
        ctx.room = roomStore.getRoomById(cmd.roomId);

        if (!ctx.room && ctx.handler.existingRoom) {
          throw new Error('Command ' + cmd.name + ' only want\'s to get handled for an existing room. (' + cmd.roomId + ')');
        }

        if (ctx.room) {
          // mark rooms that were loaded from store as "existing"
          ctx.room.existing = true;
        } else {
          // make sure that command handlers always receive a room object
          ctx.room = new Immutable.Map();
        }
      },
      function preConditions(cmd, ctx) {
        if (!ctx.handler.preCondition) {
          return;
        }
        try {
          ctx.handler.preCondition(ctx.room, cmd, userId);
        } catch (pcError) {
          throw new PreconditionError(pcError, cmd);
        }
      },
      function handle(cmd, ctx) {
        ctx.eventHandlingQueue = [];
        ctx.eventsToSend = [];

        /**
         * called from command handlers: room.apply('someEvent', payload)
         * @param eventName
         * @param eventPayload
         */
        ctx.room.applyEvent = function (eventName, eventPayload) {
          var handlerFunction = getEventHandlerFunction(ctx, userId, cmd.id, eventName, eventPayload);
          ctx.eventHandlingQueue.push(handlerFunction);
        };

        ctx.handler.fn(ctx.room, cmd);
      },
      function applyEvents(cmd, ctx) {
        context.eventHandlingQueue.forEach(eh => ctx.room = eh(ctx.room));
      },
      function saveRoomBackToStore(cmd, ctx) {
        // only if command was processed successfully and events were applied to room
        // then we store the modified room back

        // TODO: can eventHandlers "delete" the room? then ctx.room would be undefined here?
        roomStore.saveRoom(ctx.room);
      }
    ];

    var context = {};
    queue.forEach(qFn => {
      qFn(command, context);
    });

    return context.eventsToSend;
  };

  function getEventHandlerFunction(context, userId, correlationId, eventName, eventPayload) {
    var eventHandler = eventHandlers[eventName];
    if (!eventHandler) {
      throw new Error('Cannot apply unknown event ' + eventName);
    }
    return function (currentRoom) {
      // call the handler that applies the event to the room
      var updatedRoom = eventHandler(currentRoom, eventPayload);
      LOGGER.debug('applied ' + eventName + ' to room ', updatedRoom.toJS());

      // construct the event object that is sent back to clients
      context.eventsToSend.push({
        id: uuid(),
        userId: userId, // which user triggered the command -> thus is "responsible" for the event
        correlationId: correlationId,
        name: eventName,
        roomId: updatedRoom.get('id'),
        payload: eventPayload
      });

      return updatedRoom;
    };

  }

}


/**  some custom errors **/
function PreconditionError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = 'Precondition Error during "' + cmd.name + '": ' + err.message;
}
util.inherits(PreconditionError, Error);


