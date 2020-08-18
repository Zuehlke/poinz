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
    const matchingUserId = getUserIdForMessage(socket.id, msg);

    try {
      const {producedEvents} = await commandProcessor(msg, matchingUserId);

      if (!producedEvents) {
        return;
      }

      updateSocketRegistryJoining(matchingUserId, producedEvents, socket);

      sendEvents(producedEvents, producedEvents[0].roomId);

      updateSocketRegistryLeaving(matchingUserId, producedEvents, socket);
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
    } else {
      const kickedRoomEvent = getKickedRoomEvent(producedEvents);
      if (kickedRoomEvent) {
        // find sockets that match room and userId ( for the kicked user, not the kicking user )
        registry.removeMatchingSocketMappings(
          kickedRoomEvent.payload.userId,
          kickedRoomEvent.roomId
        );
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

    const newUserId = uuid();
    LOGGER.warn(`New userId ${newUserId} generated for socket ${socketId}. msg.name=${msg.name}`);
    return newUserId;
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
    // socket.rooms is at this moment already emptied
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
