const
  assert = require('assert'),
  uuid = require('node-uuid').v4,
  socketIoClient = require('socket.io-client');

/**
 * NOTE: for these integration tests, the PoinZ server must be running
 * at localhost:3000 !
 */
describe('serverIntegration', () => {

  const backendUrl = 'http://localhost:3000';

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
