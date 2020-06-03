import Promise from 'bluebird';
import Immutable from 'immutable';

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

let rooms = new Immutable.Map();

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
