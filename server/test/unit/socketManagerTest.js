import {v4 as uuid} from 'uuid';
import socketManagerFactory from '../../src/socketManager';

test('init without errors', () => {
  const sendEventToRoom = jest.fn();

  const socketManager = socketManagerFactory(getMockCmdProcessor([]), sendEventToRoom);
  expect(socketManager).toBeDefined();
  expect(socketManager.handleIncomingCommand).toBeDefined();
  expect(socketManager.onDisconnect).toBeDefined();
});

test('handle incoming command without errors', () => {
  const sendEventToRoom = jest.fn();

  const socketManager = socketManagerFactory(getMockCmdProcessor(), sendEventToRoom);

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid()
  };
  return socketManager.handleIncomingCommand(socket, dummyCommand);
});

test('registering new socket, new user, new room successfully', async () => {
  const sendEventToRoom = jest.fn();

  const joinedRoomEvent = {
    roomId: uuid(),
    name: 'joinedRoom'
  };

  const socketManager = socketManagerFactory(
    getMockCmdProcessor([joinedRoomEvent]),
    sendEventToRoom
  );

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid()
  };
  await socketManager.handleIncomingCommand(socket, dummyCommand);

  expect(socket.join.mock.calls.length).toBe(1);
  expect(socket.join.mock.calls[0][0]).toEqual(joinedRoomEvent.roomId);
});

test('should throw if produced joinedRoom event has no roomId', async () => {
  const sendEventToRoom = jest.fn();

  const joinedRoomEvent = {
    /* for some reason, no roomId*/
    name: 'joinedRoom'
  };

  const socketManager = socketManagerFactory(
    getMockCmdProcessor([joinedRoomEvent]),
    sendEventToRoom
  );

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid()
  };

  await socketManager.handleIncomingCommand(socket, dummyCommand);
  expectEmittedCommandRejected(
    socket,
    'Fatal!  No roomId after "joinedRoom" to put into socketToRoomMap!'
  );
});

test('should correctly handle joining & leaving  multiple rooms in sequence', async () => {
  const sendEventToRoom = jest.fn();
  const mockCmdProcessor = jest.fn().mockName('mockCommandProcessor');
  const socketManager = socketManagerFactory(mockCmdProcessor, sendEventToRoom);

  const socket = getMockSocketObject();
  const dummyCommand = {
    id: uuid()
  };

  const userId = uuid();

  mockCmdProcessor.mockReturnValueOnce(
    Promise.resolve({
      producedEvents: [
        {
          id: uuid(),
          userId,
          name: 'roomCreated',
          roomId: 'roomOne',
          payload: {}
        },
        {
          id: uuid(),
          userId,
          name: 'joinedRoom',
          roomId: 'roomOne',
          payload: {}
        }
      ]
    })
  );
  mockCmdProcessor.mockReturnValueOnce(
    Promise.resolve({
      producedEvents: [
        {
          roomId: 'roomOne',
          userId,
          name: 'leftRoom',
          payload: {}
        }
      ]
    })
  );
  mockCmdProcessor.mockReturnValueOnce(
    Promise.resolve({
      producedEvents: [
        {
          roomId: 'roomTwo',
          name: 'joinedRoom',
          userId,
          payload: {}
        }
      ]
    })
  );

  await socketManager.handleIncomingCommand(socket, dummyCommand);
  await socketManager.handleIncomingCommand(socket, dummyCommand);
  await socketManager.handleIncomingCommand(socket, dummyCommand);

  expect(socket.join.mock.calls.length).toBe(2);
  expect(socket.join.mock.calls[0][0]).toEqual('roomOne');
  expect(socket.join.mock.calls[1][0]).toEqual('roomTwo');

  // 4 events were produced and sent. created, joined, left, joined
  expect(sendEventToRoom.mock.calls.length).toBe(4);
});

test('should handle disconnect', async () => {
  const sendEventToRoom = jest.fn();
  const mockCmdProcessor = jest.fn().mockName('mockCommandProcessor');
  const socketManager = socketManagerFactory(mockCmdProcessor, sendEventToRoom);

  await socketManager.onDisconnect(getMockSocketObject());
});

function expectEmittedCommandRejected(socket, reason) {
  expect(socket.emit.mock.calls.length).toBe(1);
  expect(socket.emit.mock.calls[0][0]).toEqual('event');
  expect(socket.emit.mock.calls[0][1]).toMatchObject({
    name: 'commandRejected',
    payload: {
      reason
    }
  });
}

function getMockCmdProcessor(producedEvents) {
  return jest
    .fn(() =>
      Promise.resolve({
        producedEvents
      })
    )
    .mockName('mockCommandProcessor');
}

function getMockSocketObject(socketId = uuid()) {
  return {
    id: socketId,
    join: jest.fn(),
    emit: jest.fn()
  };
}
