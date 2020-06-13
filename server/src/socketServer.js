import socketIo from 'socket.io';

import socketManagerFactory from './socketManager';

let io;
let socketManager;

export default {
  init,
  close: () => io.close()
};

function init(httpServer, cmdProcessor) {
  io = socketIo(httpServer);

  const sendEventToRoom = (roomId, event) => io.to(roomId).emit('event', event);

  socketManager = socketManagerFactory(cmdProcessor, sendEventToRoom);

  io.on('connect', (socket) => {
    socket.on('disconnect', () => socketManager.onDisconnect(socket));
    socket.on('command', (msg) => socketManager.handleIncomingCommand(socket, msg));
  });
}
