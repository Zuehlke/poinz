var
  Immutable = require('immutable');


var rooms = new Immutable.Map();

var roomsStore = {
  getRoomById,
  saveRoom
};


function getRoomById(roomId) {
  return rooms.get(roomId);
}

function saveRoom(room) {
  rooms = rooms.set(room.get('id'), room);
}

module.exports = roomsStore;
