import http from 'http';
import {v4 as uuid} from 'uuid';
import socketIoClient from 'socket.io-client';

/**
 * NOTE: for these integration tests, the PoinZ server must be running
 * at localhost:3000 !
 */
const backendUrl = 'http://localhost:3000';

describe('websocket endpoint', () => {
  let socket;

  afterAll(() => {
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
        payload: {}
      })
    );
  });

  // we don't want to test all our commands + events here.
  // instead assert one roundtrip -> send valid command -> receive expected events
  // command handling for all commands is tested in unit tests (see test/unit/commands)
  test('should handle a valid command', (done) => {
    socket = socketIoClient(backendUrl);

    const commandId = uuid();

    let eventCount = 0;

    socket.on('event', (msg) => {
      expect(msg).toBeDefined();

      expect(msg.name).not.toBe('commandRejected');

      expect(msg.correlationId).toEqual(commandId);
      expect(msg.roomId).toBeDefined();

      if (eventCount === 0) {
        expect(msg.name).toEqual('roomCreated');
        expect(msg.userId).toBeDefined();
      } else if (eventCount === 1) {
        expect(msg.name).toEqual('joinedRoom');
        expect(msg.userId).toBeDefined();
        expect(msg.payload.users).toBeDefined();

        done();
      }

      eventCount++;
    });

    socket.on('connect', () =>
      socket.emit('command', {
        id: commandId,
        name: 'joinRoom',
        roomId: 'my-custom-room_' + uuid(),
        payload: {}
      })
    );
  });
});

describe('REST endpoint', () => {
  test('should return all rooms ', (done) => {
    httpGetJSON(
      {
        host: 'localhost',
        port: 3000,
        path: '/api/status',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      (err, statusCode, body) => {
        expect(err).toBeFalsy();
        expect(statusCode).toBe(200);
        expect(body.roomCount).toBeDefined();
        expect(body.rooms.length).toBeDefined();
        done();
      }
    );
  });

  /**
   * helper method to send HTTP GET requests to the backend under test
   * @param options
   * @param callback
   */
  function httpGetJSON(options, callback) {
    const req = http.request(options, (res) => {
      let output = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (output += chunk));
      res.on('end', () => {
        let parsedBody;

        try {
          parsedBody = JSON.parse(output);
        } catch (e) {
          callback(e);
        }

        callback(null, res.statusCode, parsedBody);
      });
    });

    req.on('error', callback);
    req.end();
  }
});
