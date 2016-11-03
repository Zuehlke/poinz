import Promise from 'bluebird';
import Immutable from 'immutable';

/**
 *  This is the non-persistent (in-memory) roomsStore implementation.
 *  Switch between persistent / non-persistent store is done in settings.js
 */

var rooms = new Immutable.Map();

export default {
  init,
  getRoomById,
  saveRoom,
  getAllRooms
};

function init() {
  // nothing to do here
}

function getRoomById(roomId) {
  return Promise.resolve(rooms.get(roomId));
}

function saveRoom(room) {
  rooms = rooms.set(room.get('id'), room);
  return Promise.resolve();
}

function getAllRooms() {
  return Promise.resolve(rooms);
}
