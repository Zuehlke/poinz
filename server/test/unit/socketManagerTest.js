import {v4 as uuid} from 'uuid';
import socketManagerFactory from '../../src/socketManager';

// we want to test with our real command- and event handlers.
import commandHandlers from '../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../src/eventHandlers/eventHandlers';
import commandProcessorFactory from '../../src/commandProcessor';
import {newMockRoomsStore} from './testUtils';

function initSocketManagerUnderTest(
  sendEventToRoom = jest.fn(),
  removeSocketFromRoomByIds = jest.fn()
) {
  const mockRoomsStore = newMockRoomsStore();
  const processor = commandProcessorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return socketManagerFactory(processor, sendEventToRoom, removeSocketFromRoomByIds);
}

test('init without errors', () => {
  const socketManager = initSocketManagerUnderTest();

  expect(socketManager).toBeDefined();
  expect(socketManager.handleIncomingCommand).toBeDefined();
  expect(socketManager.onDisconnect).toBeDefined();
});

test('handle incoming command. does not throw even if command handling fails (e.g. unknown command, or precondition error)', () => {
  const socketManager = initSocketManagerUnderTest();

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid(),
    userId: uuid(),
    name: 'this.is.a.unknown.command'
  };
  return socketManager.handleIncomingCommand(socket, dummyCommand);
});

test('registering new joining user to socket.IO "room"', async () => {
  const roomId = uuid();
  const userId = uuid();

  const socketManager = initSocketManagerUnderTest();

  const socket = getMockSocketObject();
  const joinCommand = {
    id: uuid(),
    userId,
    roomId,
    name: 'joinRoom',
    payload: {}
  };
  await socketManager.handleIncomingCommand(socket, joinCommand);

  expect(socket.join.mock.calls.length).toBe(1);
  expect(socket.join.mock.calls[0][0]).toEqual(roomId); // socket.IO' "join" method on the socket is called with our roomId
});

test('should correctly handle joining & leaving multiple rooms in sequence', async () => {
  const userId = uuid();
  const roomOneId = uuid();
  const roomTwoId = uuid();

  const sendEventToRoom = jest.fn();
  const removeSocketFromRoomByIds = jest.fn();

  const socketManager = initSocketManagerUnderTest(sendEventToRoom, removeSocketFromRoomByIds);

  const socket = getMockSocketObject();

  await socketManager.handleIncomingCommand(socket, {
    id: uuid(),
    userId,
    roomId: roomOneId,
    name: 'joinRoom',
    payload: {}
  });
  await socketManager.handleIncomingCommand(socket, {
    id: uuid(),
    userId,
    roomId: roomOneId,
    name: 'leaveRoom',
    payload: {}
  });
  await socketManager.handleIncomingCommand(socket, {
    id: uuid(),
    userId,
    roomId: roomTwoId,
    name: 'joinRoom',
    payload: {}
  });

  expect(socket.join.mock.calls.length).toBe(2);
  expect(socket.join.mock.calls[0][0]).toEqual(roomOneId);
  expect(socket.join.mock.calls[1][0]).toEqual(roomTwoId);

  // 7 events produced and sent (roomCreated, joinedRoom, avatarSet    then leftRoom  then again roomCreated, joinedRoom, avatarSet)
  expect(sendEventToRoom.mock.calls.length).toBe(7);

  expect(removeSocketFromRoomByIds.mock.calls.length).toBe(1);
});

test('should handle disconnect', async () => {
  const sendEventToRoom = jest.fn();
  const removeSocketFromRoomByIds = jest.fn();

  const socketManager = initSocketManagerUnderTest(sendEventToRoom, removeSocketFromRoomByIds);

  await socketManager.onDisconnect(getMockSocketObject());
});

function getMockSocketObject(socketId = uuid()) {
  return {
    id: socketId,
    join: jest.fn(),
    emit: jest.fn()
  };
}
