import socketIo from 'socket.io';
import {RateLimiterMemory} from 'rate-limiter-flexible';

import socketManagerFactory from './socketManager';
import getLogger from './getLogger';

const LOGGER = getLogger('socketServer');

let io;
let socketManager;

export default {
  init,
  close: () => io.close()
};

function init(httpServer, store) {
  io = socketIo(httpServer);

  const sendEventToRoom = (roomId, event) => io.to(roomId).emit('event', event);

  // we dont want to pass "io" down to factory and registry. pass down a cb instead...
  const removeSocketFromRoomByIds = (socketId, roomId) => {
    const connectedSocket = io.of('/').sockets.get(socketId);
    if (connectedSocket) {
      connectedSocket.leave(roomId);
    }
  };

  socketManager = socketManagerFactory(store, sendEventToRoom, removeSocketFromRoomByIds);

  const rateLimiter = process.env.NODE_ENV === 'production' ? initCommandRateLimiter() : () => ({}); // if we are in development or test environment, do not rate limit...

  io.on('connect', (socket) => {
    socket.on('disconnect', () => socketManager.onDisconnect(socket));
    socket.on('command', async (msg) => {
      await rateLimiter(socket.id);
      socketManager.handleIncomingCommand(socket, msg);
    });
  });
}

/**
 * returns a "rateLimiter(socketId)" function that will resolve if passed socketId is allowed to send commands within the current period.
 *
 * https://github.com/animir/node-rate-limiter-flexible
 */
function initCommandRateLimiter() {
  const COMMANDS_PER_SECOND_LIMIT = 4;
  const rateLimiter = new RateLimiterMemory({
    points: COMMANDS_PER_SECOND_LIMIT,
    duration: 1 // 1 = per second
  });

  return (socketId) =>
    rateLimiter.consume(socketId).catch((rateLimiterRes) => {
      // limit in current period reached
      // if a client sends more than COMMANDS_PER_SECOND_LIMIT commands within the same second on the same socket, we just ignore all subsequent commands.

      if (rateLimiterRes.consumedPoints === COMMANDS_PER_SECOND_LIMIT + 1) {
        // log once, when limit is just reached
        LOGGER.warn(
          `rate limit on socket ${socketId} reached. Will block subsequent commands for current period on this socket....`
        );
      }
    });
}
