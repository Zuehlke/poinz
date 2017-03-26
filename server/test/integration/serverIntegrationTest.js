import assert from 'assert';
import http from 'http';
import {v4 as uuid} from 'uuid';
import socketIoClient from 'socket.io-client';

/**
 * NOTE: for these integration tests, the PoinZ server must be running
 * at localhost:3000 !
 */
describe('serverIntegration', () => {

  const backendUrl = 'http://localhost:3000';

  describe('websocket endpoint', () => {

    it('should accept websocket connections', done => {
      const socket = socketIoClient(backendUrl);
      socket.on('connect', () => done());
    });

    it('should handle command messages on websocket connections', done => {
      const socket = socketIoClient(backendUrl);

      const commandId = uuid();

      socket.on('event', msg => {
        assert(msg);
        assert.equal(msg.name, 'commandRejected');
        assert.equal(msg.correlationId, commandId);
        assert(msg.payload.reason);
        done();
      });

      socket.on('connect', () =>
        socket.emit('command', {
          id: commandId,
          name: 'unknownCommand',
          payload: {}
        }));
    });

    // we don't want to test all our commands + events here.
    // instead assert one roundtrip -> send valid command -> receive expected events
    // command handling for all commands is tested in unit tests (see test/unit/commands)
    it('should handle a valid command', done => {
      const socket = socketIoClient(backendUrl);

      const commandId = uuid();
      const roomId = uuid();

      var eventCount = 0;

      socket.on('event', msg => {
        assert(msg);
        assert.equal(msg.correlationId, commandId);
        assert.equal(msg.roomId, roomId);
        eventCount++;

        if (eventCount === 1) {
          assert.equal(msg.name, 'roomCreated');
          assert(msg.payload.userId);
        } else {
          assert.equal(msg.name, 'joinedRoom');
          assert(msg.payload.userId);
          assert(msg.payload.users);
          done();
        }
      });

      socket.on('connect', () =>
        socket.emit('command', {
          id: commandId,
          roomId: roomId,
          name: 'joinRoom',
          payload: {}
        }));
    });

  });


  describe('REST endpoint', () => {

    it('should return all rooms ', done => {

      httpGetJSON({
          host: 'localhost',
          port: 3000,
          path: '/api/status',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (err, statusCode, body) => {
          assert(!err, err);
          assert.equal(statusCode, 200);
          assert(body.roomCount);
          assert(body.rooms.length);
          done();
        });
    });

  });

});

/**
 * helper method to send HTTP GET requests to the backend under test
 * @param options
 * @param callback
 */
function httpGetJSON(options, callback) {
  const req = http.request(options, res => {
    var output = '';
    res.setEncoding('utf8');
    res.on('data', chunk => output += chunk);
    res.on('end', () => {
      var parsedBody;

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
