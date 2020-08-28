import util from 'util';
import Immutable from 'immutable';
import {v4 as uuid} from 'uuid';

import queueFactory from './sequenceQueue';
import validateCommand from './commandSchemaValidator';
import getLogger from './getLogger';

const LOGGER = getLogger('commandProcessor');

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
    if (!userId) {
      throw new Error('Fatal! socketServer has to provide userId!');
    }

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
   * @param {function} proceed function to proceed the queue (handle the next job/command)
   */
  async function jobHandler(job, proceed) {
    const {command, userId} = job;
    const context = {userId};

    logCommand(command, userId);

    try {
      const steps = [
        validate,
        findMatchingCommandHandler,
        loadRoom,
        preConditions,
        handle,
        applyEvents,
        saveRoomBackToStore
      ];

      await steps.reduce((p, step) => p.then(() => step(context, command)), Promise.resolve(null));
    } catch (err) {
      proceed(err); // proceed with next job in queue
      job.reject(err);
      return;
    }

    logEvents(context, command.id);

    job.resolve({
      producedEvents: context.eventsToSend,
      room: context.room.toJS()
    });

    proceed(); // proceed with next job in queue
  }

  /**
   * 1. Validate incoming command (syntactically, against schema)
   */
  async function validate(context, cmd) {
    validateCommand(cmd);
  }

  /**
   * 2. Find matching command handler according to command name.
   * */
  async function findMatchingCommandHandler(ctx, cmd) {
    const handler = commandHandlers[cmd.name];

    if (!handler) {
      throw new Error(`No command handler found for ${cmd.name}`);
    }
    ctx.handler = handler;
  }

  /**
   * 3. Load Room object by command.roomId
   *
   * By Default, a room object must exist in the store that matches the given roomId in the command.
   * For some commands, it is valid that no matching room must exist. Then an "empty" room with the given roomId is created.
   * Command handlers must specify this with "canCreateRoom:true"
   *
   * @returns {Promise} returns a promise that resolves as soon as the room was successfully loaded
   */
  async function loadRoom(ctx, cmd) {
    if (!cmd.roomId) {
      throw new Error(
        'No roomId given in Command. this is invalid and should have been caught by command validation (schema).'
      );
    }

    // try loading by id
    const room = await store.getRoomById(cmd.roomId);
    if (room) {
      ctx.room = room;
      return;
    }

    // room does not yet exist. if handler allows it, we create it.
    if (!ctx.handler.canCreateRoom) {
      throw new Error(`Command "${cmd.name}" only wants to get handled for an existing room!`);
    }

    // command is allowed to create new room.
    ctx.room = new Immutable.Map({
      id: cmd.roomId,
      pristine: true
    });
  }

  /**
   * 4. Run command preconditions which are defined in commandHandlers.
   * Preconditions receive the room, the command and the userId and can do some semantic checks.
   */
  async function preConditions(ctx, cmd) {
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
   */
  async function handle(ctx, cmd) {
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
      ctx.eventHandlingQueue.push((currentRoom) => {
        const updatedRoom = eventHandler(currentRoom, eventPayload, ctx.userId);

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
    ctx.handler.fn(ctx.room, cmd, ctx.userId);
  }

  /**
   * 6. Apply events to the room.
   * Events modify the room state.
   * All produced events are applied in-order.
   */
  async function applyEvents(ctx) {
    ctx.eventHandlingQueue.forEach((evtHandler) => (ctx.room = evtHandler(ctx.room)));
  }

  /**
   *  7. Store modified room object (asynchronous)
   *  Command was processed successfully and all produced events were applied and modified the room object.
   *  Now store the new state.
   *
   *  @returns {Promise} returns a promise that resolves as soon as the room is stored
   */
  async function saveRoomBackToStore(ctx) {
    // TODO: can eventHandlers "delete" the room? then ctx.room would be undefined here?
    ctx.room = ctx.room.set('lastActivity', Date.now()).set('markedForDeletion', false);

    await store.saveRoom(ctx.room);
  }
}

function logCommand(command, userId) {
  if (LOGGER.isLevelEnabled('debug')) {
    LOGGER.debug(
      `HANDLING COMMAND user=${userId} room=${command.roomId} commandName=${command.name} commandId=${command.id}`,
      command
    );
  } else if (LOGGER.isLevelEnabled('info')) {
    LOGGER.info(
      `HANDLING COMMAND user=${userId} room=${command.roomId} commandName=${command.name} commandId=${command.id}`
    );
  }
}

function logEvents(context, correlationId) {
  if (LOGGER.isLevelEnabled('debug')) {
    LOGGER.debug(
      `PRODUCED EVENTS  user=${context.userId} room=${context.room.get('id')}` +
        context.eventsToSend.map((e) => e.name).join(', '),
      context.eventsToSend,
      `correlationId=${correlationId}`
    );
  } else if (LOGGER.isLevelEnabled('info')) {
    LOGGER.info(
      `PRODUCED EVENTS  user=${context.userId} room=${context.room.get('id')}  ` +
        context.eventsToSend.map((e) => e.name).join(', ') +
        `  correlationId=${correlationId}`
    );
  }
}

function PreconditionError(err, cmd) {
  this.stack = err.stack;
  this.name = this.constructor.name;
  this.message = `Precondition Error during "${cmd.name}": ${err.message}`;
}

util.inherits(PreconditionError, Error);
