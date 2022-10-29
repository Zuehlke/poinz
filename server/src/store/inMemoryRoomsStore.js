import getLogger from '../getLogger.js';

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

const rooms = {};

const LOGGER = getLogger('inMemoryRoomsStore');

export default {
  init,
  close,
  getRoomById,
  saveRoom,
  getAllRooms,
  housekeeping,
  getStoreType
};

async function init() {
  // nothing to do here
  LOGGER.info('Using in-memory storage');
}

async function close() {
  // nothing to do here
}

async function housekeeping() {
  // nothing to do here so far. currently we assume that since this is in memory, storage gets erased regularly on application restart.
  // since this currently happens at least once a day (since current deployment kills app if not used), no action needed here
  return {
    markedForDeletion: [],
    deleted: []
  };
}

async function getRoomById(roomId) {
  if (!roomId) {
    throw new Error('Cannot get Room from inMemoryStore if no roomId is provided!');
  }

  const room = rooms[roomId];
  if (!room) {
    return undefined;
  }

  return detachObject(room);
}

async function saveRoom(room) {
  rooms[room.id] = detachObject(room);
}

async function getAllRooms() {
  return rooms;
}

function getStoreType() {
  return 'InMemoryRoomsStore';
}

/**
 * mimick the "detaching" ob objects when they are persisted in a store (e.g. a database)
 * imperfect: "undefined" properties will be lost, functions will be lost, JS "Date" instances are serialized
 * Thus, make sure that dates are stored as numbers (unix time)
 *
 * Works for our use!
 */
const detachObject = (obj) => JSON.parse(JSON.stringify(obj));
