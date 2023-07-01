import {faker} from '@faker-js/faker';

import uuid from '../../src/uuid';
import poinzSocketClientFactory from './poinzSocketClient';
import {issueJwt} from '../../src/auth/jwtService';
import {httpGetJSON} from './systemTestUtils.js';

/**
 * NOTE: for these tests, the Poinz server must be running
 * at localhost:3000
 */

test('should return backend status', async () => {
  const {statusCode, body} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/status',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  expect(statusCode).toBe(200);
  expect(body.roomCount).toBeDefined();
  expect(body.rooms.length).toBeDefined();
});

test('should export room as json', async () => {
  // first make sure a room exists
  const roomId = uuid();
  const userId = uuid();
  const client = poinzSocketClientFactory();
  await client.cmdAndWait(client.cmds.joinRoom(roomId, userId, faker.person.firstName()), 3);
  client.disconnect();

  // export the room
  const {statusCode, body} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/export/room/' + roomId,
    method: 'GET',
    headers: {
      'X-USER': userId
    }
  });

  expect(statusCode).toBe(200);
  expect(body).toMatchObject({
    roomId
  });
  expect(body.stories.length).toBe(1);
});

test('should export room with pw protection as json', async () => {
  // first make sure a room exists
  const roomId = uuid();
  const userId = uuid();
  const client = poinzSocketClientFactory();
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'some-user-name', 'test@tester.de'),
    7
  );

  const customRandomPassword = faker.internet.password(16);
  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, customRandomPassword), 1);

  // re-join existing room with password, in order to get a token
  const joinRoomEvents = await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'some-user-name', 'test@tester.de', customRandomPassword),
    2
  );
  client.disconnect();

  const validToken = joinRoomEvents[1].payload.token;
  expect(validToken).toBeDefined(); // just to make sure we got the token from the correct event (at index 1)

  // export the room
  const {statusCode, body} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/export/room/' + roomId,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${validToken}`
    }
  });

  expect(statusCode).toBe(200);
  expect(body.roomId).toBe(roomId);
  expect(body.stories).toBeDefined();
  expect(body.stories.length).toBe(1);
});

test('should not allow export room with pw protection with invalid token', async () => {
  // first make sure a room exists
  const roomId = uuid();
  const userId = uuid();
  const client = poinzSocketClientFactory();
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'some-user-name', faker.internet.email()),
    7
  );

  const customRandomPassword = faker.internet.password({length: 16});
  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, customRandomPassword), 1);
  client.disconnect();

  const newTokenThatDoesNotMatch = issueJwt(roomId, 'some-user-id');
  // export the room
  const {statusCode} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/export/room/' + roomId,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${newTokenThatDoesNotMatch}`
    }
  });

  expect(statusCode).toBe(403);
});

test('should return 404 if room does not exist (export)', async () => {
  const {statusCode, body} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/export/room/1234',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  expect(statusCode).toBe(404);
  expect(body.message).toBeDefined();
});

test('should return whole room state', async () => {
  // first make sure a room exists
  const roomId = uuid();
  const userId = uuid();
  const client = poinzSocketClientFactory();
  const eventsFromJoin = await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, faker.person.firstName()),
    5
  );

  await client.cmdAndWait(
    client.cmds.trashStory(roomId, userId, eventsFromJoin[4].payload.storyId),
    1
  );
  await client.cmdAndWait(
    client.cmds.deleteStory(roomId, userId, eventsFromJoin[4].payload.storyId),
    1
  );

  const [storyAdded] = await client.cmdAndWait(
    client.cmds.addStory(roomId, userId, 'test-story'),
    2
  );
  await client.cmdAndWait(
    client.cmds.giveEstimate(roomId, userId, storyAdded.payload.storyId, 3),
    2
  );
  client.disconnect();

  // fetch the whole room state
  const {statusCode, body} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/room/' + roomId,
    method: 'GET',
    headers: {
      'X-USER': userId
    }
  });

  expect(statusCode).toBe(200);
  expect(body).toMatchObject({
    autoReveal: true,
    id: roomId,
    selectedStory: storyAdded.payload.storyId,
    stories: [
      {
        consensus: 3,
        estimations: {
          [userId]: 3
        },
        id: storyAdded.payload.storyId,
        revealed: true,
        title: 'test-story'
      }
    ],
    users: [
      {
        avatar: 0,
        id: userId
      }
    ]
  });
});
