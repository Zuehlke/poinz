import {v4 as uuid} from 'uuid';

import getLogger from './getLogger';
import socketRegistryFactory from './socketRegistry';

const LOGGER = getLogger('socketManager');

LOGGER.transports[0].level = 'debug';

export default function socketManagerFactory(commandProcessor, sendEventToRoom) {
  const registry = socketRegistryFactory();

  return {
    handleIncomingCommand,
    onDisconnect
  };

  async function handleIncomingCommand(socket, msg) {
    const matchingUserId = getUserIdForMessage(socket.id, msg);

    try {
      const {producedEvents} = await commandProcessor(msg, matchingUserId);

      if (!producedEvents) {
        return;
      }

      updateSocketRegistry(matchingUserId, producedEvents, socket);

      sendEvents(producedEvents, producedEvents[0].roomId);
    } catch (commandProcessingError) {
      handleCommandProcessingError(commandProcessingError, msg, socket);
    }
  }

  function updateSocketRegistry(userId, producedEvents, socket) {
    const joinedRoomEvent = getJoinedRoomEvent(producedEvents);
    if (joinedRoomEvent) {
      registry.registerSocketMapping(socket, userId, joinedRoomEvent.roomId);
    }

    const leftRoomEvent = getLeftRoomEvent(producedEvents);
    if (leftRoomEvent) {
      registry.removeSocketMapping(socket.id, leftRoomEvent.userId, leftRoomEvent.roomId);
    } else {
      const kickedRoomEvent = getKickedRoomEvent(producedEvents);
      if (kickedRoomEvent) {
        registry.removeSocketMapping(socket.id, kickedRoomEvent.userId, kickedRoomEvent.roomId);
      }
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
   * lookup of already set userId for given socket.
   * if no match found, check if it is the special case of a "joinRoom" command.
   * this is the only command where the client can preset a userId.
   * If it is present, use it, otherwise generate a new unique userId.
   *
   * @param {string} socketId
   * @param msg
   * @return {string} the userId
   */
  function getUserIdForMessage(socketId, msg) {
    const mapping = registry.getMapping(socketId);
    if (mapping && mapping.userId) {
      return mapping.userId;
    }

    if (msg.name === 'joinRoom' && msg.payload && msg.payload.userId) {
      return msg.payload.userId;
    }

    return uuid();
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
    LOGGER.error(error.message + '\n' + error.stack);
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
    // socket.rooms is at this moment already emptied
    const mapping = registry.getMapping(socket.id);

    if (!mapping) {
      // this happens if user is on landing page, socket is opened, then leaves, never joined a room. perfectly fine.
      LOGGER.debug(`Socket ${socket.id} disconnected. no mapping...`);
      return;
    }

    const {userId, roomId} = mapping;

    LOGGER.debug(`Socket ${socket.id} disconnected. Mapping to user ${userId} in room ${roomId}`);

    if (registry.isLastSocketForUserId(userId)) {
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
