import socketIo from 'socket.io-client';
import log from 'loglevel';
import store, { ACTIONS } from './store';
import interfaceMsgs from '../../../interfaceMessageNames';

const io = socketIo('http://localhost:3000');

io.on('connect', () => log.info('socket to server connected'));
io.on(interfaceMsgs.DISCONNECT, () => log.info('socket from server disconnected'));
io.on(interfaceMsgs.PERSON_JOINED_ROOM, payload => ACTIONS.personJoinedRoom(payload));
io.on(interfaceMsgs.JOINED_ROOM, payload => ACTIONS.joinedRoom(payload));
io.on(interfaceMsgs.ROOM_CREATED, payload => ACTIONS.roomCreated(payload));

const hub = {
  requestRoom
};

function requestRoom(roomId) {
  io.emit(interfaceMsgs.ROOM_REQUESTED, roomId);
}

export default hub;
