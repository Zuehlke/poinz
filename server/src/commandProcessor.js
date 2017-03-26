import util from 'util';
import Promise from 'bluebird';
import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';

import queueFactory from './sequenceQueue';
import validateCommand from './commandSchemaValidator';

/**
 * wrapped in a factory function.
 * Allows us to pass in custom list of handlers during tests.
 *
 * @param {object} commandHandlers A collection of command handlers indexed by command name
 * @param {object} eventHandlers
 * @param {object} store
 * @returns {function} the processCommand function
 */
export default function commandProcessorFactory(commandHandlers, eventHandlers, store) {

  // setup sequence queue
  const queue = queueFactory(jobHandler);

  /**
   *  The command processor handles incoming commands.
   *  (is asynchronous - returns a Promise)
   *  For every command the following steps are done.
   *
   *  1. Validation
   *  2. Find matching command handler
   *  3. Load room
   *  4. Precondition check
   *  5. Handle Command
   *  6. Apply events
   *  7. Store room
   *
   *  Every step can throw an error which will reject the promise.
   *
   *  @param {object} command
   *  @param {string} userId The id of the user that sent the command. if command is "joinRoom" user id is not yet given and will be undefined!
   *  @returns {Promise<object[]>} Promise that resolves to a list of events that were produced by this command. (they are already applied to the room state)
   */
  return function processCommand(command, userId) {
    /**
     * In a scenario where two commands for the same room arrive only a few ms apart, both command handlers
     * would receive the same room object from the store. the second command would override the state manipulations of the first.
     *
     * This is why we push incoming commands into a queue (see sequenceQueue).
     */
    return new Promise((resolve, reject) => queue.push({command, userId, resolve, reject}));
  };

  /**
   * queue job handler
   *
   * @param {object} job
   * @param {function} proceed function to proceed the queue (handle the next job)
   */
  function jobHandler(job, proceed) {
    const {command, userId} = job;
    const context = {userId};

    validate(command)
      .then(() => findMatchingCommandHandler(context, command))
      .then(() => loadRoom(context, command))
      .then(() => preConditions(context, command))
      .then(() => handle(context, command))
      .then(() => applyEvents(context))
      .then(() => saveRoomBackToStore(context))
      .then(() => {
        proceed();
        job.resolve(context.eventsToSend);
      })
      .catch(err => {
        proceed(err);
        job.reject(err);
      });

  }

  /** 1. Validate incoming command (syntactically, against schema) **/
  function validate(cmd) {
    // use "new Promise" instead of "Promise.resolve" -> errors thrown in invocation of "commandSchemaValidator" should
    // reject returned promise.
    return new Promise(resolve => resolve(validateCommand(cmd)));
  }

  /**
   * 2. Find matching command handler according to command name.
   * */
  function findMatchingCommandHandler(ctx, cmd) {
    const handler = commandHandlers[cmd.name];
    if (!handler) {
      throw new Error(`No command handler found for ${cmd.name}`);
    }
    ctx.handler = handler;
  }

  /**
   * 3. Load Room object by command.roomId
   * For some commands it is valid that the room does not yet exist in the store.
   * Command handlers define whether they expect an existing room or not
   *
   * @param {object} ctx context object that is used to hold state between processing steps
   * @param {object} cmd
   * @returns {Promise} returns a promise that resolves as soon as the room was successfully loaded
   */
  function loadRoom(ctx, cmd) {
    return store
      .getRoomById(cmd.roomId)
      .then(room => {
        if (!room && ctx.handler.existingRoom) {
          // if no room with this id is in the store but the commandHandler defines "existingRoom=true"
          throw new Error(`Command "${cmd.name}" only want\'s to get handled for an existing room. (${cmd.roomId})`);
        }

        if (room) {
          ctx.room = room;
        } else {
          // make sure that command handlers always receive a room object
          ctx.room = new Immutable.Map();
        }
      });
  }

  /**
   * 4. Run command preconditions which are defined in commandHandlers.
   * Preconditions receive the room, the command and the userId and can do some semantic checks.
   *
   * @param {object} ctx context object that is used to hold state between processing steps
   * @param {object} cmd
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
   *  The handler function produces events
   *
   * @param {object} ctx context object that is used to hold state between processing steps
   * @param {object} cmd
   */
  function handle(ctx, cmd) {
    ctx.eventHandlingQueue = [];
    ctx.eventsToSend = [];

    /**
     * called from command handlers: room.apply('someEvent', payload)
     * @param {string} eventName
     * @param {object} eventPayload
     */
    ctx.room.applyEvent = (eventName, eventPayload) => {
      const eventHandler = eventHandlers[eventName];
      if (!eventHandler) {
        throw new Error('Cannot apply unknown event ' + eventName);
      }

      // events are handled sequentially since events most often update the state of the room ("are applied to the room")
      ctx.eventHandlingQueue.push(currentRoom => {
        const updatedRoom = eventHandler(currentRoom, eventPayload);

        // build the event object that is sent back to clients
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
   *
   * @param {object} ctx context object that is used to hold state between processing steps
   */
  function applyEvents(ctx) {
    ctx.eventHandlingQueue.forEach(evtHandler => ctx.room = evtHandler(ctx.room));
  }

  /**
   *  7. Store modified room object (asynchronous)
   *  Command was processed successfully and all produced events were applied and modified the room object.
   *  Now store the new state.
   *
   *  @param {object} ctx context object that is used to hold state between processing steps
   *  @returns {Promise} returns a promise that resolves as soon as the room is stored
   */
  function saveRoomBackToStore(ctx) {
    // TODO: can eventHandlers "delete" the room? then ctx.room would be undefined here?
    ctx.room = ctx.room.set('lastActivity', new Date().getTime());
    return store.saveRoom(ctx.room);
  }

}

function PreconditionError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = `Precondition Error during "${cmd.name}": ${err.message}`;
}
util.inherits(PreconditionError, Error);
