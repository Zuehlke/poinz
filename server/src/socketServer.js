import {v4 as uuid} from 'uuid';
import socketIo from 'socket.io';
import getLogger from './getLogger';

const LOGGER = getLogger('socketServer');

let io, commandProcessor;

const socketToUserIdMap = {},
  socketToRoomMap = {};

export default {
  init,
  close
};

function init(httpServer, cmdProcessor) {
  io = socketIo(httpServer);
  io.on('connect', handleNewConnection);
  commandProcessor = cmdProcessor;
}

function close() {
  io.close();
}

function handleNewConnection(socket) {
  socket.on('disconnect', onSocketDisconnect.bind(undefined, socket));
  socket.on('command', (msg) => handleIncomingCommand(socket, msg));
}

function handleIncomingCommand(socket, msg) {
  const matchingUserId = getMatchingUserIdForSocketMessage(socket, msg);

  commandProcessor(msg, matchingUserId)
    .then(({producedEvents}) => {
      if (producedEvents && producedEvents.length) {
        if (!socketToUserIdMap[socket.id]) {
          registerUserWithSocket(producedEvents[0].roomId, socket, matchingUserId);
        }
        sendEvents(producedEvents, producedEvents[0].roomId);
      }
    })
    .catch((commandProcessingError) =>
      handleCommandProcessingError(commandProcessingError, msg, socket)
    );
}

/**
 * lookup of already set userId for given socket.
 * if no match found, check if it is the special case of a "joinRoom" command.
 * this is the only command where the client can preset a userId.
 * If it is present, use it, otherwise generate a new unique userId.
 *
 * @param socket
 * @param msg
 * @return {string} the userId
 */
function getMatchingUserIdForSocketMessage(socket, msg) {
  const matchingUserId = socketToUserIdMap[socket.id];
  if (matchingUserId) {
    return matchingUserId;
  }

  // TODO:   this is before command validation via json schema, should we validate here?
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
  producedEvents.forEach((producedEvent) => io.to(roomId).emit('event', producedEvent));
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
 * we need do keep the mapping of a socket to room and userId, so that we can
 * - for every command on a socket, know the userId
 * - produce "user left" events on socket disconnect.
 *
 * @param {string} roomId
 * @param socket
 * @param userIdToStore
 */
function registerUserWithSocket(roomId, socket, userIdToStore) {
  if (!userIdToStore) {
    throw new Error('No userId after "joinedRoom" to put into socketToUserIdMap!');
  }
  socketToRoomMap[socket.id] = roomId;
  socketToUserIdMap[socket.id] = userIdToStore;

  // put socket into socket.io room with given id
  socket.join(roomId, () =>
    LOGGER.debug(`User ${userIdToStore} on socket ${socket.id} joined room ${roomId}`)
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
