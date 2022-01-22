import http from 'http';
import socketIoClient from 'socket.io-client';

import uuid from '../../src/uuid';
import poinzSocketClientFactory from './poinzSocketClient';
import {issueJwt} from '../../src/auth/jwtService';

/**
 * NOTE: for these integration tests, the PoinZ server must be running
 * at localhost:3000 !
 */
const backendUrl = 'http://localhost:3000';

describe('websocket endpoint', () => {
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

    const receivedEvents = await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId), 3);
    client.disconnect();

    expect(receivedEvents[0].name).toBe('roomCreated');
    expect(receivedEvents[0].userId).toBeDefined();
    expect(receivedEvents[1].name).toBe('joinedRoom');
    expect(receivedEvents[1].userId).toBe(firstUserId);
    expect(receivedEvents[1].payload.users).toBeDefined();
  });
});

describe('REST endpoint', () => {
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
    const client = poinzSocketClientFactory(backendUrl);
    await client.cmdAndWait(client.cmds.joinRoom(roomId, userId), 3);
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
    const client = poinzSocketClientFactory(backendUrl);
    const events = await client.cmdAndWait(
      client.cmds.joinRoom(roomId, userId, 'some-user-name', 'test@tester.de', '1234'),
      3
    );
    client.disconnect();

    // export the room
    const {statusCode, body} = await httpGetJSON({
      host: 'localhost',
      port: 3000,
      path: '/api/export/room/' + roomId,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${events[2].payload.token}`
      }
    });

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({
      roomId
    });
    expect(body.stories.length).toBe(1);
  });

  test('should not allow export room with pw protection with invalid token', async () => {
    // first make sure a room exists
    const roomId = uuid();
    const userId = uuid();
    const client = poinzSocketClientFactory(backendUrl);
    await client.cmdAndWait(
      client.cmds.joinRoom(roomId, userId, 'some-user-name', 'test@tester.de', '1234'),
      3
    );
    client.disconnect();

    // export the room
    const {statusCode} = await httpGetJSON({
      host: 'localhost',
      port: 3000,
      path: '/api/export/room/' + roomId,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${issueJwt(roomId, userId)}` // this token will be generated with another secret -> invalid
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
    const client = poinzSocketClientFactory(backendUrl);
    const eventsFromJoin = await client.cmdAndWait(client.cmds.joinRoom(roomId, userId), 5);

    await client.cmdAndWait(
      client.cmds.trashStory(roomId, userId, eventsFromJoin[3].payload.storyId),
      1
    );
    await client.cmdAndWait(
      client.cmds.deleteStory(roomId, userId, eventsFromJoin[3].payload.storyId),
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

  /**
   * helper method to send HTTP GET requests to the backend under test.
   * parsed returned JSON body to object
   *
   * @param options
   */
  function httpGetJSON(options) {
    return httpGet(options).then((result) => {
      return {
        ...result,
        body: result.body ? JSON.parse(result.body) : ''
      };
    });
  }

  /**
   * helper method to send HTTP GET requests to the backend under test
   * @param options
   */
  function httpGet(options) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let output = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (output += chunk));
        res.on('end', () => {
          try {
            resolve({statusCode: res.statusCode, body: output});
          } catch (parseError) {
            reject(parseError);
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
});
