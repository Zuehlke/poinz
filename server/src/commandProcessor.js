var
  util = require('util'),
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
   *  1. Validate incoming command (syntactically, agains schema)
   *  2. Find command handler (for command.name)
   *  3. Get Room object (for command.roomId)
   *  4. Run command preconditions (defined in commandHandler)
   *  5. Handle the command
   *  6. Apply events
   *  7. Store modified room object
   *
   *  Every step can throw an error which will lead to a command rejection.
   *
   *  @param {object} command
   *  @param {string} userId The id of the user that send the command. if command is "joinRoom" user id is not yet given and will be undefined!
   */
  return function processCommand(command, userId) {

    LOGGER.debug(command);

    // TODO: this might get asynchronous sometime...
    // e.g. when roomStore gets persistent -> asynchronous db access?
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
        ctx.handler.fn({
          attributes: context.room,
          /**
           * called from command handlers: room.apply('someEvent', payload)
           * @param eventName
           * @param eventPayload
           */
          applyEvent: function (eventName, eventPayload) {
            var handlerFunction = getEventHandlerFunction(ctx, userId, cmd.id, eventName, eventPayload);
            ctx.eventHandlingQueue.push(handlerFunction);
          }
        }, cmd);
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
      var updatedRoom = eventHandler(currentRoom, eventPayload);
      LOGGER.debug('applied ' + eventName + ' to room ', updatedRoom.toJS());
      var evt = {
        id: uuid(),
        userId: userId, // which user triggered the command -> thus is "responsible" for the event
        correlationId: correlationId,
        name: eventName,
        roomId: updatedRoom.get('id'),
        payload: eventPayload
      };
      context.eventsToSend.push(evt);
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


