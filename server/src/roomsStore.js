var Immutable = require('immutable');

/**
 * At the moment we have a very simple in-memory store.
 * This means: on server restart (node process restart), all information is lost.
 * This could be extended with a persistent store (maybe a mongo db?)
 */

var rooms = new Immutable.Map();

module.exports = {
  getRoomById,
  saveRoom
};

function getRoomById(roomId) {
  return rooms.get(roomId);
}

function saveRoom(room) {
  rooms = rooms.set(room.get('id'), room);
}


