var _ = require('lodash');

var rooms = {};

var roomsStore = {
  getRoomById,
  createNewRoom,
  removeSocket,
  addSocketToRoom,
  addPersonToRoom
};


/**
 *
 * @param socket
 * @returns the room the given socket was removed from or undefined
 */
function removeSocket(socket) {
  return _.find(rooms, function (room) {
    var reducedSockets = _.reject(room.sockets, {id: socket.id});

    if (reducedSockets.length !== room.sockets.length) {
      room.sockets = reducedSockets;
      return true;
    }

    return false;
  });
}

function getRoomById(roomId) {
  return rooms[roomId];
}

function createNewRoom(roomId) {
  if (rooms[roomId]) {
    throw new Error('Cannot create room ' + roomId + '. It already exists!');
  }

  rooms[roomId] = {
    sockets: [],
    people: []
  };

  return rooms[roomId];
}

function addSocketToRoom(roomId, socket) {
  if (!rooms[roomId]) {
    throw new Error('Cannot add socket to room ' + roomId + '. It does not exist!');
  }

  rooms[roomId].sockets.push(socket);
  return rooms[roomId];
}

function addPersonToRoom(roomId, personId) {
  if (!rooms[roomId]) {
    throw new Error('Cannot add person to room ' + roomId + '. It does not exist!');
  }

  rooms[roomId].people.push(personId);
  return rooms[roomId];
}

module.exports = roomsStore;
