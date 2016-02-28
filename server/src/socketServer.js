var
  http = require('http'),
  uuid = require('node-uuid').v4,
  socketIo = require('socket.io'),
  log = require('loglevel');

var LOGGER = log.getLogger('socketServer');

var io;
var socketToUserIdMap = {};
var socketToRoomMap = {};
var commandProcessor;

module.exports.init = init;

function init(app, cmdProcessor) {
  var server = http.createServer(app);
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
  LOGGER.debug('incoming command', msg);

  try {
    var userId = socketToUserIdMap[socket.id];

    var producedEvents = commandProcessor(msg, userId);

    if (msg.name === 'joinRoom') {
      // TODO: for this, we need to "know" a lot about the commandHandler for "joinRoom". How to improve that?
      registerUserWithSocket(msg, socket, producedEvents[producedEvents.length - 1].payload.userId);
    }

    // send produced events to all sockets in room
    producedEvents.forEach(producedEvent => {
      io.to(msg.roomId).emit('event', producedEvent);
      LOGGER.debug('outgoing event', producedEvent);
    });
  } catch (commandProcessingError) {
    handleCommandProcessingError(commandProcessingError, msg, socket);
  }

}

/**
 * If command processing failed, we send a "commandRejected" event to the client that issued the command.
 * (not sent to all sockets in the room)
 *
 */
function handleCommandProcessingError(error, command, socket) {
  LOGGER.error(error.stack);
  var commandRejectedEvent = {
    name: 'commandRejected',
    id: uuid(),
    roomId: command.roomId,
    payload: {
      command: command,
      reason: error.message
    }
  };

  LOGGER.debug('outgoing event', commandRejectedEvent);

  // command rejected event is only sent to the one socket that sent the command
  socket.emit('event', commandRejectedEvent);
}

function registerUserWithSocket(msg, socket, userIdToStore) {
  // at this point, we know that join was successful
  // we need do keep the mapping of a socket to room and userId - so that we can produce "user left" events
  // on socket disconnect.
  socketToRoomMap[socket.id] = msg.roomId;
  if (!userIdToStore) {
    var noUserIdAfterJoinErr = new Error('Why is there no userId!');
    LOGGER.error(noUserIdAfterJoinErr);
    throw noUserIdAfterJoinErr;
  }
  socketToUserIdMap[socket.id] = userIdToStore;

  // put socket into socket.io room with given id
  socket.join(msg.roomId, function () {
    LOGGER.debug('socket with id ' + socket.id + ' joined room ' + msg.roomId);
  });
}

function onSocketDisconnect(socket) {

  var userId = socketToUserIdMap[socket.id];
  var roomId = socketToRoomMap[socket.id]; // socket.rooms is at this moment already emptied. so we have to use our own map

  if (!userId || !roomId) {
    // this can happen if the server was restarted, and a client re-connected!
    LOGGER.warn('could not send leaveRoom command for ' + userId + ' in ' + roomId);
    return;
  }

  // "manually" send a "leaveRoom" command
  handleIncomingCommand(socket, {
    id: uuid(),
    roomId: roomId,
    name: 'leaveRoom',
    payload: {
      userId,
      connectionLost: true // user did not send "leaveRoom" command manually. But connection was lost (e.g. browser closed)
    }
  });

}

