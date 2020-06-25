import getLogger from './getLogger';

const LOGGER = getLogger('socketRegistry');

/**
 * we need do keep the mapping of a socket to userId,
 * so that we can retrieve the userId for any message (command) sent on this socket.
 *
 * we need do keep the mapping of a socket to room,
 * so that we can produce "user left" events on socket disconnect.
 *
 * maps socket IDs  to userIds and roomIds
 */
export default function socketRegistryFactory() {
  const registry = {};

  return {
    registerSocketMapping,
    removeSocketMapping,
    isLastSocketForUserId,
    getMapping
  };

  function getMapping(socketId) {
    return registry[socketId];
  }

  function registerSocketMapping(socket, userId, roomId) {
    LOGGER.debug(`Registering socket ${socket.id} : user ${userId} and room ${roomId}`);

    if (registry[socket.id]) {
      LOGGER.warn(`Overriding old mapping for socket ${socket.id}`);
    }
    registry[socket.id] = {
      userId,
      roomId
    };

    // also join sockets together in a socket.io "room" , so that we can emit messages to all sockets in that room
    socket.join(roomId);
  }

  function removeSocketMapping(socketId, userId, roomId) {
    if (!registry[socketId]) {
      return;
    }

    LOGGER.debug(`Removing mapping: socket ${socketId} -> [user ${userId}, room ${roomId}]`);

    if (registry[socketId].userId !== userId) {
      LOGGER.warn(
        `socket to userId mapping mismatch:    socket ${socketId} maps to user ${registry[socketId].userId}.   expected user ${userId}`
      );
    }
    if (registry[socketId].roomId !== roomId) {
      LOGGER.warn(
        `socket to roomId mapping mismatch:    socket ${socketId} maps to room ${registry[socketId].roomId}.   expected room ${roomId}`
      );
    }

    delete registry[socketId];
  }

  function isLastSocketForUserId(userId) {
    const socketsOfThatUser = Object.entries(registry).filter(
      (entry) => entry[1].userId === userId
    );
    if (socketsOfThatUser.length > 1) {
      LOGGER.debug(
        `User ${userId} has multiple open sockets:  ${regEntriesToString(socketsOfThatUser)}`
      );
    }
    return socketsOfThatUser.length === 1;
  }

  function regEntriesToString(regEntries) {
    return regEntries
      .map((re) => `${re[0]} -> [user ${re[1].userId}, room ${re[1].roomId}]`)
      .join('     ');
  }
}
