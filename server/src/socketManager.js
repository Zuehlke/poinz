import {v4 as uuid} from 'uuid';

import getLogger from './getLogger';
import socketRegistryFactory from './socketRegistry';

const LOGGER = getLogger('socketManager');

/**
 *
 * @param commandProcessor
 * @param {function} sendEventToRoom
 * @param {function} removeSocketFromRoomByIds
 */
export default function socketManagerFactory(
  commandProcessor,
  sendEventToRoom,
  removeSocketFromRoomByIds
) {
  const registry = socketRegistryFactory(removeSocketFromRoomByIds);

  return {
    handleIncomingCommand,
    onDisconnect
  };

  async function handleIncomingCommand(socket, msg) {
    try {
      const userId = getUserIdForMessage(socket.id, msg);
      const {producedEvents} = await commandProcessor(msg, userId);

      if (!producedEvents || producedEvents.length < 1) {
        return;
      }

      updateSocketRegistryJoining(userId, producedEvents, socket);

      sendEvents(producedEvents, producedEvents[0].roomId);

      updateSocketRegistryLeaving(userId, producedEvents, socket);
    } catch (commandProcessingError) {
      handleCommandProcessingError(commandProcessingError, msg, socket);
    }
  }

  function updateSocketRegistryJoining(userId, producedEvents, socket) {
    const joinedRoomEvent = getJoinedRoomEvent(producedEvents);
    if (joinedRoomEvent) {
      registry.registerSocketMapping(socket, userId, joinedRoomEvent.roomId);
    }
  }

  function updateSocketRegistryLeaving(userId, producedEvents, socket) {
    const leftRoomEvent = getLeftRoomEvent(producedEvents);
    if (leftRoomEvent) {
      registry.removeSocketMapping(socket.id, leftRoomEvent.userId, leftRoomEvent.roomId);
      return;
    }

    const kickedRoomEvent = getKickedRoomEvent(producedEvents);
    if (kickedRoomEvent) {
      // find and remove sockets that match room and userId (for the kicked user, not the kicking user)
      registry.removeMatchingSocketMappings(kickedRoomEvent.payload.userId, kickedRoomEvent.roomId);
    }
  }

  function getJoinedRoomEvent(producedEvents) {
    if (!producedEvents) {
      return undefined;
    }
    return producedEvents.find((e) => e.name === 'joinedRoom');
  }

  function getLeftRoomEvent(producedEvents) {
    if (!producedEvents) {
      return undefined;
    }
    return producedEvents.find((e) => e.name === 'leftRoom');
  }

  function getKickedRoomEvent(producedEvents) {
    if (!producedEvents) {
      return undefined;
    }
    return producedEvents.find((e) => e.name === 'kicked');
  }

  /**
   * By default, the message contains the userId.
   * only for "joinRoom" the userId can be undefined / not set, then we generate a new userId here
   *
   * @param {string} socketId
   * @param msg
   * @return {string} the userId
   */
  function getUserIdForMessage(socketId, msg) {
    if (msg.userId) {
      // message provides userId, this is given for most commands.
      return msg.userId;
    }

    if (msg.name === 'joinRoom') {
      // if no userId is given, it must be a joinRoom command. this is the only command that allows that.
      return uuid();
    }

    throw new Error(`Command must provide userId. msg.name=${msg.name}`);
  }

  /**
   * send produced events to all sockets in room
   * @param producedEvents
   * @param roomId
   */
  function sendEvents(producedEvents, roomId) {
    producedEvents.forEach((producedEvent) => sendEventToRoom(roomId, producedEvent));
  }

  /**
   * If command processing failed, we send a "commandRejected" event to the client that issued the command.
   * (not sent to all sockets in the room)
   *
   */
  function handleCommandProcessingError(error, command, socket) {
    // for debugging, you might want to log error.stack  LOGGER.error(error.message + '\n' + error.stack);
    LOGGER.warn(error.message);

    const commandRejectedEvent = {
      name: 'commandRejected',
      id: uuid(),
      correlationId: command.id,
      roomId: command.roomId,
      payload: {
        command: command,
        reason: error.message
      }
    };

    // command rejected event is only sent to the one socket that sent the command
    socket.emit('event', commandRejectedEvent);
  }

  /**
   * if the socket is disconnected (e.g. user closed browser tab), manually produce and handle
   * a "leaveRoom" command that will mark the user.
   */
  async function onDisconnect(socket) {
    // socket.rooms is at this moment already emptied (by socketIO)
    const mapping = registry.getMapping(socket.id);

    if (!mapping) {
      // this happens if user is on landing page, socket is opened, then leaves, never joined a room. perfectly fine.
      LOGGER.debug(`Socket ${socket.id} disconnected. no mapping...`);
      return;
    }

    const {userId, roomId} = mapping;

    LOGGER.debug(
      `Socket ${socket.id} disconnected. Socket is currently mapping to user ${userId} in room ${roomId}`
    );

    if (registry.isLastSocketForUserId(userId)) {
      // we "manually" trigger a "leaveRoom" command
      const leaveRoomCommand = {
        id: uuid(),
        roomId: roomId,
        name: 'leaveRoom',
        payload: {
          connectionLost: true // user did not send "leaveRoom" command manually. But connection was lost (e.g. browser closed)
        }
      };
      await handleIncomingCommand(socket, leaveRoomCommand);
    } else {
      LOGGER.debug(
        `User ${userId} in room ${roomId}, has more open sockets. Removing mapping for socket ${socket.id}`
      );
      registry.removeSocketMapping(socket.id, userId, roomId);
    }
  }
}
