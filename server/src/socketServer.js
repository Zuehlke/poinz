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

  // we dont want to pass "io" down to factory and registry. pass down a cb instead...
  const removeSocketFromRoomByIds = (socketId, roomId) => {
    const connectedSocket = io.sockets.connected[socketId];
    if (connectedSocket) {
      connectedSocket.leave(roomId);
    }
  };

  socketManager = socketManagerFactory(cmdProcessor, sendEventToRoom, removeSocketFromRoomByIds);

  io.on('connect', (socket) => {
    socket.on('disconnect', () => socketManager.onDisconnect(socket));
    socket.on('command', (msg) => socketManager.handleIncomingCommand(socket, msg));
  });
}
