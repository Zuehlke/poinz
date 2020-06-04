import Promise from 'bluebird';
import Immutable from 'immutable';

import getLogger from '../getLogger';

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

let rooms = new Immutable.Map();

const LOGGER = getLogger('inMemoryRoomsStore');

export default {
  init,
  close,
  getRoomById,
  getRoomByAlias,
  saveRoom,
  getAllRooms,
  housekeeping
};

function init() {
  // nothing to do here
  LOGGER.info('using in memory storage');
  return Promise.resolve();
}

function close() {
  // nothing to do here
  return Promise.resolve();
}

function housekeeping() {
  // nothing to do here so far. currently we assume that since this is in memory, storage gets erased regularly on application restart.
  // since this currently happens at least once a day (since current deployment kills app if not used), no action needed here
  return Promise.resolve({
    markedForDeletion: [],
    deleted: []
  });
}

function getRoomById(roomId) {
  if (!roomId) {
    return Promise.resolve(undefined);
  }

  return Promise.resolve(rooms.get(roomId));
}

function getRoomByAlias(alias) {
  if (!alias) {
    return Promise.resolve(undefined);
  }

  return Promise.resolve(rooms.find((room) => room.get('alias') === alias));
}

function saveRoom(room) {
  rooms = rooms.set(room.get('id'), room);
  return Promise.resolve();
}

function getAllRooms() {
  return Promise.resolve(rooms);
}
