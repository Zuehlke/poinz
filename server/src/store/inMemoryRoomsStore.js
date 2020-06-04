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
  getAllRooms
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
