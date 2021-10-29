import util from 'util';
import {v4 as uuid} from 'uuid';
import fastq from 'fastq';

import getLogger from './getLogger';
import {throwIfUserIdNotFoundInRoom} from './commandHandlers/commonPreconditions';
import {
  commandSchemaValidatorFactory,
  roomSchemaValidatorFactory,
  getSchemasFromRealCommandHandlers
} from './validation/schemaValidators';

const LOGGER = getLogger('commandProcessor');

/**
 * -- "The Core component" of the poinz backend --
 *
 * The command processor handles all incoming commands. And performs the same 7 steps for each command (details see below).
 *
 * - If a command is processed successfully, a list of produced events is returned (wrapped in a promise)
 *
 * - Command processing can fail due to a number of reasons: unknown command, invalid structure, preconditions that fail, etc.
 *   In this case, the returned promise will reject with an Error
 *
 * @param {object} commandHandlers A collection of command handlers indexed by command name
 * @param {object} baseCommandSchema The base command schema that every command must fulfil. (can be referenced by all commands).
 * @param {object} eventHandlers
 * @param {object} store The Rooms Store
 * @returns {function} the processCommand function
 */
export default function commandProcessorFactory(
  commandHandlers,
  baseCommandSchema,
  eventHandlers,
  store
) {
  const queue = fastq(jobHandler, 1);

  checkCommandHandlersForStructure(commandHandlers);

  const validateCmd = commandSchemaValidatorFactory({
    ...getSchemasFromRealCommandHandlers(commandHandlers),
    command: baseCommandSchema
  });

  const validateRoom = roomSchemaValidatorFactory();

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
   *  @param {string} userId The id of the user that sent the command
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
     * This is why we push incoming commands into a queue. Commands will be handled in sequence.
     */
    return new Promise((resolve, reject) =>
      queue.push({command, userId}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  };

  /**
   * queue job handler
   *
   * @param {object} job
   * @param {function} proceed function to proceed the queue (handle the next job/command)
   */
  async function jobHandler(job, proceed) {
    const {userId} = job;
    const command = sanitizeRoomId(job.command);

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
      return;
    }

    logEvents(context, command.id);

    proceed(null, {
      producedEvents: context.eventsToSend,
      room: context.room
    }); // proceed with next job in queue
  }

  /**
   * 1. Validate incoming command (syntactically, against schema)
   */
  async function validate(ctx, cmd) {
    validateCmd(cmd);
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
    ctx.room = {
      id: cmd.roomId,
      pristine: true
    };
  }

  /**
   * 4. Run command preconditions which are defined in commandHandlers.
   * Preconditions receive the room, the command and the userId and can do some semantic checks.
   */
  async function preConditions(ctx, cmd) {
    try {
      if (!ctx.handler.skipUserIdRoomCheck) {
        throwIfUserIdNotFoundInRoom(ctx.room, ctx.userId);
      }

      if (ctx.handler.preCondition) {
        ctx.handler.preCondition(ctx.room, cmd, ctx.userId);
      }
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
     * called from command handlers: pushEvent('someEvent', payload)
     * @param {string} eventName
     * @param {object} eventPayload
     * @param {boolean} [restricted] If true, the event will later only be emitted to the sending user (i.e. the socket that sent the correlating command) - not the whole room.
     */
    function pushEvent(eventName, eventPayload, restricted = false) {
      const eventHandler = eventHandlers[eventName];
      if (!eventHandler) {
        throw new Error('Cannot push unknown event ' + eventName);
      }

      // events are handled sequentially since events most often update the state of the room ("are applied to the room")
      ctx.eventHandlingQueue.push((currentRoom) => {
        const updatedRoom = eventHandler(currentRoom, eventPayload, ctx.userId);

        if (!updatedRoom) {
          throw new Error(
            `Fatal error: Event Handlers must return the room object! event "${eventName}"`
          );
        }

        if (updatedRoom === currentRoom) {
          throw new Error(
            `Fatal error: Event Handlers must not return same room object! event "${eventName}"`
          );
        }

        /** make sure to not send a "password" property to the client **/
        delete eventPayload.password;

        // build the event object that is sent back to clients
        ctx.eventsToSend.push({
          id: uuid(),
          userId: ctx.userId, // which user triggered the command / is "responsible" for the event
          correlationId: cmd.id,
          name: eventName,
          roomId: updatedRoom.id,
          restricted,
          payload: eventPayload
        });

        return updatedRoom;
      });
    }

    // invoke the command handler function
    ctx.handler.fn(pushEvent, ctx.room, cmd, ctx.userId);
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
    ctx.room.lastActivity = Date.now();
    ctx.room.markedForDeletion = false;

    validateRoom(ctx.room);

    await store.saveRoom(ctx.room);
  }
}

/**
 * remove whitespaces and (url encoded) %20 from roomId on given command and replace them with dashes.
 * This is done "very early" when handling a command. before the command even is validated.
 *
 * @param command
 * @return {{roomId}|*}
 */
export function sanitizeRoomId(command) {
  if (!command || !command.roomId) {
    return command;
  }

  command.roomId = command.roomId.replace(/ /g, '-');
  command.roomId = command.roomId.replace(/%20/g, '-');

  return command;
}

function checkCommandHandlersForStructure(cmdHandlers) {
  const checkSingleCmdHandlerForStructure = (handlerEntry) => {
    if (!handlerEntry[1].schema) {
      throw new Error(`Fatal error: CommandHandler "${handlerEntry[0]}" does not define "schema"!`);
    }
    if (
      typeof handlerEntry[1].schema !== 'object' ||
      handlerEntry[1].schema.constructor !== Object
    ) {
      throw new Error(
        `Fatal error: "schema" on commandHandler "${handlerEntry[0]}" must be an object!`
      );
    }

    if (!handlerEntry[1].fn || !(handlerEntry[1].fn instanceof Function)) {
      throw new Error(
        `Fatal error: "fn" on commandHandler "${handlerEntry[0]}" must be a function!`
      );
    }
  };

  Object.entries(cmdHandlers).forEach(checkSingleCmdHandlerForStructure);
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
      `PRODUCED EVENTS  user=${context.userId} room=${context.room.id}` +
        context.eventsToSend.map((e) => e.name).join(', '),
      context.eventsToSend,
      `correlationId=${correlationId}`
    );
  } else if (LOGGER.isLevelEnabled('info')) {
    LOGGER.info(
      `PRODUCED EVENTS  user=${context.userId} room=${context.room.id}  ` +
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
