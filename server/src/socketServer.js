import http from 'http';
import {v4 as uuid} from 'uuid';
import socketIo from 'socket.io';
import getLogger from './getLogger';

const LOGGER = getLogger('socketServer');

let io, commandProcessor;

const socketToUserIdMap = {},
  socketToRoomMap = {};

export default {init};

function init(app, cmdProcessor) {
  const server = http.createServer(app);
  io = socketIo(server);
  io.on('connect', handleNewConnection);
  commandProcessor = cmdProcessor;
  return server;
}

function handleNewConnection(socket) {
  socket.on('disconnect', onSocketDisconnect.bind(undefined, socket));
  socket.on('command', (msg) => handleIncomingCommand(socket, msg));
}

function handleIncomingCommand(socket, msg) {
  commandProcessor(msg, socketToUserIdMap[socket.id])
    .then((producedEvents) => {
      const joinedRoomEvent = producedEvents.find((ev) => ev.name === 'joinedRoom');
      if (joinedRoomEvent) {
        registerUserWithSocket(joinedRoomEvent, socket, joinedRoomEvent.payload.userId);
      }
      if (producedEvents && producedEvents.length) {
        sendEvents(producedEvents, producedEvents[0].roomId);
      }
    })
    .catch((commandProcessingError) =>
      handleCommandProcessingError(commandProcessingError, msg, socket)
    );
}

/**
 * send produced events to all sockets in room
 * @param producedEvents
 * @param roomId
 */
function sendEvents(producedEvents, roomId) {
  producedEvents.forEach((producedEvent) => io.to(roomId).emit('event', producedEvent));
}

/**
 * If command processing failed, we send a "commandRejected" event to the client that issued the command.
 * (not sent to all sockets in the room)
 *
 */
function handleCommandProcessingError(error, command, socket) {
  LOGGER.error(error.stack);
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
 * at this point, we know that the join was successful.
 * we need do keep the mapping of a socket to room and userId - so that we can produce "user left" events
 * on socket disconnect.
 *
 * @param {object} joinedRoomEvent the handled joinedRoomEvent event
 * @param socket
 * @param userIdToStore
 */
function registerUserWithSocket(joinedRoomEvent, socket, userIdToStore) {
  if (!userIdToStore) {
    throw new Error('No userId after "joinedRoom" to put into socketToUserIdMap!');
  }
  socketToRoomMap[socket.id] = joinedRoomEvent.roomId;
  socketToUserIdMap[socket.id] = userIdToStore;

  // put socket into socket.io room with given id
  socket.join(joinedRoomEvent.roomId, () =>
    LOGGER.debug(
      `User ${userIdToStore} on socket ${socket.id} joined room ${joinedRoomEvent.roomId}`
    )
  );
}

const isLastSocketForUserId = (userId) =>
  Object.values(socketToUserIdMap).filter((socketUserId) => socketUserId === userId).length === 1;

/**
 * if the socket is disconnected (e.g. user closed browser tab), manually produce and handle
 * a "leaveRoom" command that will mark the user.
 */
function onSocketDisconnect(socket) {
  const userId = socketToUserIdMap[socket.id];
  const roomId = socketToRoomMap[socket.id]; // socket.rooms is at this moment already emptied. so we have to use our own map

  if (!userId || !roomId) {
    // this can happen if the server was restarted, and a client re-connected!
    LOGGER.debug(`could not send leaveRoom command for userId=${userId} in roomId=${roomId}`);
    return;
  }

  if (isLastSocketForUserId(userId)) {
    const leaveRoomCommand = {
      id: uuid(),
      roomId: roomId,
      name: 'leaveRoom',
      payload: {
        userId,
        connectionLost: true // user did not send "leaveRoom" command manually. But connection was lost (e.g. browser closed)
      }
    };
    handleIncomingCommand(socket, leaveRoomCommand);
  } else {
    LOGGER.debug(
      `User userId=${userId} disconnected from room roomId=${roomId}, but there are other connections open for this user`
    );
  }

  delete socketToRoomMap[socket.id];
  delete socketToUserIdMap[socket.id];
}
