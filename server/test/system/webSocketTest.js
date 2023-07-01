import socketIoClient from 'socket.io-client';
import {faker} from '@faker-js/faker';

import uuid from '../../src/uuid';
import poinzSocketClientFactory from './poinzSocketClient';

/**
 * NOTE: for these tests, the Poinz server must be running
 * at localhost:3000
 */
const backendUrl = 'http://localhost:3000';

let socket;

afterEach(() => {
  if (socket) {
    socket.disconnect();
  }
});

test('should accept websocket connections', (done) => {
  socket = socketIoClient(backendUrl);
  socket.on('connect', () => done());
});

test('should handle command messages on websocket connections', (done) => {
  socket = socketIoClient(backendUrl);

  const commandId = uuid();

  socket.on('event', (msg) => {
    expect(msg).toBeDefined();
    expect(msg.name).toEqual('commandRejected');
    expect(msg.correlationId).toEqual(commandId);
    expect(msg.payload.reason).toEqual(
      'Command validation Error during "unknownCommand": Cannot validate command, no matching schema found for "unknownCommand"!'
    );
    done();
  });

  socket.on('connect', () =>
    socket.emit('command', {
      id: commandId,
      name: 'unknownCommand',
      userId: uuid(),
      payload: {}
    })
  );
});

// we don't want to test all our commands + events here.
// instead assert one roundtrip -> send valid command -> receive expected events
// command handling for all commands is tested in unit tests (see test/unit/commands)
test('should handle a valid command', async () => {
  const client = poinzSocketClientFactory(backendUrl);

  const roomId = uuid();
  const firstUserId = uuid();

  const receivedEvents = await client.cmdAndWait(
    client.cmds.joinRoom(roomId, firstUserId, faker.person.firstName()),
    3
  );
  client.disconnect();

  expect(receivedEvents[0].name).toBe('roomCreated');
  expect(receivedEvents[0].userId).toBeDefined();
  expect(receivedEvents[1].name).toBe('joinedRoom');
  expect(receivedEvents[1].userId).toBe(firstUserId);
  expect(receivedEvents[1].payload.users).toBeDefined();
});
