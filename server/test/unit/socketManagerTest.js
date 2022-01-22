import uuid from '../../src/uuid';
import socketManagerFactory from '../../src/socketManager';

import {newMockRoomsStore} from './testUtils';

/**
 *
 * This is quite a "white-box" test of the socketManager.
 * There are various combinations of joining, leaving, kicking, disconnecting  that need to be handled correctly.
 *
 * Throughout these scenarios, the socket.IO "room" needs to be kept in sync with our logical "room".
 */

test('init without errors', () => {
  const socketManager = initSocketManagerUnderTest();
  expect(socketManager).toBeDefined();
  expect(socketManager.handleIncomingCommand).toBeDefined();
  expect(socketManager.onDisconnect).toBeDefined();
});

test('handle incoming command. does not throw even if command handling fails (e.g. unknown command, or precondition error)', async () => {
  const socketManager = initSocketManagerUnderTest();

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid(),
    userId: uuid(),
    name: 'this.is.a.unknown.command'
  };
  await socketManager.handleIncomingCommand(socket, dummyCommand);

  expect(socket.cmdRejectedEvts.length).toBe(1); // leads to a "commandRejected" event being emitted only to the one socket
});

test('registering new joining user to socket.IO "room"', async () => {
  const roomId = uuid();

  const socketManager = initSocketManagerUnderTest();

  const socket = getMockSocketObject();
  const joinCommand = {
    id: uuid(),
    roomId,
    // here, no userId is passed along .  (i.e. new browser / first time using poinz / local storage cleared)
    name: 'joinRoom',
    payload: {}
  };
  await socketManager.handleIncomingCommand(socket, joinCommand);

  expect(socket.cmdRejectedEvts.length).toBe(0); // no commands rejected

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

  expect(socket.cmdRejectedEvts.length).toBe(0); // no commands rejected

  expect(socket.join.mock.calls.length).toBe(2);
  expect(socket.join.mock.calls[0][0]).toEqual(roomOneId);
  expect(socket.join.mock.calls[1][0]).toEqual(roomTwoId);

  // 7 events produced and sent (roomCreated, joinedRoom, avatarSet, storyAdded, storySelected    then leftRoom  then again roomCreated, joinedRoom, avatarSet, storyAdded, storySelected)
  expect(sendEventToRoom.mock.calls.length).toBe(11);

  expect(removeSocketFromRoomByIds.mock.calls.length).toBe(1);
});

test('should correctly use userId from command', async () => {
  const userId = uuid();
  const roomOneId = uuid();

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
    name: 'setUsername',
    payload: {
      username: 'changed'
    }
  });

  expect(socket.cmdRejectedEvts.length).toBe(0); // no commands rejected

  expect(socket.join.mock.calls.length).toBe(1);
  expect(socket.join.mock.calls[0][0]).toEqual(roomOneId);
});

test('should correctly handle "kick" case', async () => {
  const userIdOne = uuid();
  const userIdTwo = uuid();
  const roomId = uuid();

  const sendEventToRoom = jest.fn();
  const removeSocketFromRoomByIds = jest.fn();

  const socketManager = initSocketManagerUnderTest(sendEventToRoom, removeSocketFromRoomByIds);

  const socketOne = getMockSocketObject();
  const socketTwo = getMockSocketObject();
  const socketThree = getMockSocketObject();

  // two users join the same room
  await socketManager.handleIncomingCommand(socketOne, {
    id: uuid(),
    userId: userIdOne,
    roomId,
    name: 'joinRoom',
    payload: {}
  });
  await socketManager.handleIncomingCommand(socketTwo, {
    id: uuid(),
    userId: userIdTwo,
    roomId,
    name: 'joinRoom',
    payload: {}
  });
  // user two joins twice, same userId, separate socket (second browser tab!)
  await socketManager.handleIncomingCommand(socketThree, {
    id: uuid(),
    userId: userIdTwo,
    roomId,
    name: 'joinRoom',
    payload: {}
  });

  // user one kicks user two
  await socketManager.handleIncomingCommand(socketOne, {
    id: uuid(),
    userId: userIdOne,
    roomId,
    name: 'kick',
    payload: {
      userId: userIdTwo
    }
  });

  expect(socketOne.cmdRejectedEvts.length).toBe(0); // no commands rejected
  expect(socketTwo.cmdRejectedEvts.length).toBe(0); // no commands rejected

  // all three sockets get joined together into same room
  expect(socketOne.join.mock.calls.length).toBe(1);
  expect(socketOne.join.mock.calls[0][0]).toBe(roomId);
  expect(socketTwo.join.mock.calls.length).toBe(1);
  expect(socketTwo.join.mock.calls[0][0]).toBe(roomId);
  expect(socketThree.join.mock.calls.length).toBe(1);
  expect(socketThree.join.mock.calls[0][0]).toBe(roomId);

  expect(removeSocketFromRoomByIds.mock.calls.length).toBe(2); // both sockets of userTwo are removed!
  expect(removeSocketFromRoomByIds.mock.calls[0][0]).toBe(socketTwo.id);
  expect(removeSocketFromRoomByIds.mock.calls[0][1]).toBe(roomId);
  expect(removeSocketFromRoomByIds.mock.calls[1][0]).toBe(socketThree.id);
  expect(removeSocketFromRoomByIds.mock.calls[1][1]).toBe(roomId);
});

test('emits commandRejected if no userId is present in "normal" command', async () => {
  const userId = uuid();
  const roomOneId = uuid();

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
    // userId is omitted here!
    roomId: roomOneId,
    name: 'setUsername',
    payload: {
      username: 'changed'
    }
  });

  expect(socket.join.mock.calls.length).toBe(1);
  expect(socket.join.mock.calls[0][0]).toEqual(roomOneId);

  expect(sendEventToRoom.mock.calls.length).toBe(5); // created, joined, avatarSet, storyAdded, storySelected

  expect(socket.cmdRejectedEvts.length).toBe(1); // the commandRejectedEvent gets emitted to the one socket (not the room)
  expect(socket.cmdRejectedEvts[0]).toMatchObject({
    name: 'commandRejected'
  });
});

test('should handle disconnect for unmapped user', async () => {
  const sendEventToRoom = jest.fn();
  const removeSocketFromRoomByIds = jest.fn();

  const socketManager = initSocketManagerUnderTest(sendEventToRoom, removeSocketFromRoomByIds);

  const socket = getMockSocketObject();

  await socketManager.onDisconnect(socket);
});

test('should handle disconnect for mapped user', async () => {
  const userId = uuid();
  const roomId = uuid();

  const sendEventToRoom = jest.fn();
  const removeSocketFromRoomByIds = jest.fn();

  const socketManager = initSocketManagerUnderTest(sendEventToRoom, removeSocketFromRoomByIds);

  const socket = getMockSocketObject();

  await socketManager.handleIncomingCommand(socket, {
    id: uuid(),
    userId,
    roomId,
    name: 'joinRoom',
    payload: {}
  });

  await socketManager.onDisconnect(socket);

  expect(removeSocketFromRoomByIds.mock.calls.length).toBe(1);
  expect(removeSocketFromRoomByIds.mock.calls[0][0]).toBe(socket.id);
  expect(removeSocketFromRoomByIds.mock.calls[0][1]).toBe(roomId);

  // created, joined, avatarSet, storyAdded, storySelected  AND "connectionLost"
  expect(sendEventToRoom.mock.calls.length).toBe(6);
  expect(sendEventToRoom.mock.calls[5][1]).toMatchObject({
    name: 'connectionLost'
  });
});

function getMockSocketObject(socketId = uuid()) {
  const cmdRejectedEvts = [];
  return {
    id: socketId,
    join: jest.fn(),
    emit: (msgName, event) => {
      if (event.name === 'commandRejected') {
        cmdRejectedEvts.push(event);
      }
    },
    cmdRejectedEvts
  };
}

function initSocketManagerUnderTest(
  sendEventToRoom = jest.fn(),
  removeSocketFromRoomByIds = jest.fn()
) {
  return socketManagerFactory(newMockRoomsStore(), sendEventToRoom, removeSocketFromRoomByIds);
}
