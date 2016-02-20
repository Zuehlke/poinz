var Immutable = require('immutable');

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


