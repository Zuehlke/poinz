import {v4 as uuid} from 'uuid';

import getLogger from './getLogger';

const LOGGER = getLogger('socketManager');

export default function socketManagerFactory(commandProcessor, sendEventToRoom) {
  const socketToUserIdMap = {};
  const socketToRoomMap = {};

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

      const joinedRoomEvent = getJoinedRoomEvent(producedEvents);
      if (joinedRoomEvent) {
        registerUserWithSocket(socket.id, matchingUserId);
        registerSocketWithRoom(joinedRoomEvent.roomId, socket);
      }

      if (hasLeftRoomEvent(producedEvents)) {
        unregisterUserWithSocket(socket.id);
        unregisterSocketWithRoom(socket.id);
      }

      sendEvents(producedEvents, producedEvents[0].roomId);
    } catch (commandProcessingError) {
      handleCommandProcessingError(commandProcessingError, msg, socket);
    }
  }

  function getJoinedRoomEvent(producedEvents) {
    if (!producedEvents) {
      return undefined;
    }
    return producedEvents.find((e) => e.name === 'joinedRoom');
  }

  function hasLeftRoomEvent(producedEvents) {
    if (!producedEvents) {
      return undefined;
    }
    return !!producedEvents.find((e) => e.name === 'leftRoom');
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
    const matchingUserId = socketToUserIdMap[socketId];
    if (matchingUserId) {
      return matchingUserId;
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
   * we need do keep the mapping of a socket to userId,
   * so that we can retrieve the userId for any message (command) sent on this socket
   */
  function registerUserWithSocket(socketId, userId) {
    socketToUserIdMap[socketId] = userId;
  }

  function unregisterUserWithSocket(socketId) {
    delete socketToUserIdMap[socketId];
  }

  /**
   * we need do keep the mapping of a socket to room,
   * so that we can produce "user left" events on socket disconnect.
   *
   * also join sockets together in a socket.io "room" , so that we can emit messages to all sockets in that room
   */
  function registerSocketWithRoom(roomId, socket) {
    if (!roomId) {
      throw new Error('Fatal!  No roomId after "joinedRoom" to put into socketToRoomMap!');
    }
    socketToRoomMap[socket.id] = roomId;

    socket.join(roomId, () => LOGGER.debug(`Socket ${socket.id} joined room ${roomId}`));
  }

  function unregisterSocketWithRoom(socketId) {
    delete socketToRoomMap[socketId];
  }

  /**
   * if the socket is disconnected (e.g. user closed browser tab), manually produce and handle
   * a "leaveRoom" command that will mark the user.
   */
  async function onDisconnect(socket) {
    const userId = socketToUserIdMap[socket.id];
    const roomId = socketToRoomMap[socket.id]; // socket.rooms is at this moment already emptied. so we have to use our own map

    if (!userId || !roomId) {
      // this happens if user is on landing page, socket is opened, then leaves, never joined a room. perfectly fine.
      LOGGER.debug(`Socket disconnected. no mapping to userId (${userId}) or roomId (${roomId})`);
      return;
    }

    if (isLastSocketForUserId(userId)) {
      const leaveRoomCommand = {
        id: uuid(),
        roomId: roomId,
        name: 'leaveRoom',
        payload: {
          connectionLost: true // user did not send "leaveRoom" command manually. But connection was lost (e.g. browser closed)
        }
      };
      await handleIncomingCommand(socket, leaveRoomCommand);
    }
  }

  function isLastSocketForUserId(userId) {
    const socketsOfThatUser = Object.values(socketToUserIdMap).filter(
      (socketUserId) => socketUserId === userId
    );
    return socketsOfThatUser.length === 1;
  }
}
