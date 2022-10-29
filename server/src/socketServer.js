import {Server} from 'socket.io';
import {RateLimiterMemory} from 'rate-limiter-flexible';

import socketManagerFactory from './socketManager.js';
import getLogger from './getLogger.js';

const LOGGER = getLogger('socketServer');

let io;

export default {
  init,
  close: () => io.close()
};

function init(httpServer, store) {
  io = new Server(httpServer);

  // we don't want to pass "io" down to socketManager and registry. pass down callbacks instead...
  const socketManager = socketManagerFactory(
    store,
    (roomId, event) => io.to(roomId).emit('event', event),
    (socketId, roomId) => {
      const connectedSocket = io.of('/').sockets.get(socketId);
      connectedSocket?.leave(roomId);
    }
  );

  // in production environment, initialize a command rate limiter - a noop function otherwise
  const rateLimiter = process.env.NODE_ENV === 'production' ? initCommandRateLimiter() : () => ({});

  io.on('connect', (socket) => {
    socket.on('disconnect', () => socketManager.onDisconnect(socket));
    socket.on('command', async (msg) => {
      await rateLimiter(socket.id);
      await socketManager.handleIncomingCommand(socket, msg);
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
