var
  http = require('http'),
  uuid = require('node-uuid').v4,
  socketIo = require('socket.io'),
  roomStore = require('./roomsStore'),
  interfaceMsgs = require('../interfaceMessageNames.js');


function init(app) {
  var server = http.createServer(app);
  var io = socketIo(server);
  io.on(interfaceMsgs.CONNECTION, onNewSocketConnection);
  return server;
}

function onNewSocketConnection(socket) {
  socket.on(interfaceMsgs.DISCONNECT, onSocketDisconnect.bind(undefined, socket));
  socket.on(interfaceMsgs.ROOM_REQUESTED, onRequestRoom.bind(undefined, socket));
}

function onRequestRoom(socket, roomId) {
  console.log('I got a room request ', roomId);

  var personId = uuid(); // TODO: should we use the socket#id directly?
  var room = roomStore.getRoomById(roomId);
  if (room) {
    roomStore.addSocketToRoom(roomId, socket);
    room = roomStore.addPersonToRoom(roomId, personId);
  } else {
    // does not yet exist, let's create it
    roomStore.createNewRoom(roomId);
    roomStore.addSocketToRoom(roomId, socket);
    room = roomStore.addPersonToRoom(roomId, personId);
    // notify the requester that he created a new room
    socket.emit(interfaceMsgs.ROOM_CREATED, {
      roomId: roomId
    });
  }

  // notify the requester that he joined the room
  socket.emit(interfaceMsgs.JOINED_ROOM, {
    roomId: roomId,
    personId: personId,
    people: room.people
  });
  // notify all people in this room
  broadCastToRoom(room, interfaceMsgs.PERSON_JOINED_ROOM, {personId: personId});
}

function onSocketDisconnect(socket) {
  console.log('disconnect, remove socket...');
  var room = roomStore.removeSocket(socket);
  if (room) {
    // notify all sockets in this room
    broadCastToRoom(room, interfaceMsgs.PERSON_LEFT_ROOM);
  }
}

function broadCastToRoom(room, eventName, payload) {
  room.sockets.forEach(function (roomSocket) {
    roomSocket.emit(eventName, payload);
  });
}


module.exports.init = init;
