import Promise from 'bluebird';
import Immutable from 'immutable';

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

let rooms = new Immutable.Map();

export default {
  init,
  getRoomById,
  getRoomByAlias,
  saveRoom,
  getAllRooms
};

function init() {
  // nothing to do here
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
