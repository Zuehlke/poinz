const
  assert = require('assert'),
  _ = require('lodash'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  processorFactory = require('../src/commandProcessor');

describe('commandProcessor', () => {

  const mockRoomsStore = {
    getRoomById: _.noop,
    saveRoom: _.noop
  };

  it('process a dummy command successfully', () => {

    const processor = processorFactory({
      setUsername: {
        fn: function (room, command) {
          room.applyEvent('usernameSet', command.payload);
        }
      }
    }, {
      usernameSet: function () {
        return new Immutable.Map();
      }
    }, mockRoomsStore);

    const producedEvents = processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    });

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);
    assert.equal(producedEvents[0].name, 'usernameSet');
  });

  it('process a dummy command with No Handler', () => {

    const processor = processorFactory({
      // no command handlers
    }, {
      // no event handlers
    }, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    }), /No handler found for setUsername/);

  });

  it('process a dummy command where command handler produced unknown event', () => {

    const processor = processorFactory({
      setUsername: {
        fn: function (room) {
          room.applyEvent('unknownEvent', {});
        }
      }
    }, {
      // no event handlers
    }, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    }), /Cannot apply unknown event unknownEvent/);

  });

  it('process a dummy command where command precondition throws', () => {

    const processor = processorFactory({
      setUsername: {
        preCondition: function () {
          throw new Error('Uh-uh. nono!');
        }
      }
    }, {
      // no event handlers
    }, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    }), /Precondition Error during "setUsername": Uh-uh. nono!/);
  });

  it('process a dummy command where command validation fails', () => {

    const processor = processorFactory({}, {}, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      // no name -> cannot load appropriate schema
      payload: {}
    }), /Command validation Error during "undefined": Command must contain a name/);

  });

  it('process a dummy command where command validation fails (schema)', () => {

    const processor = processorFactory({}, {}, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {}
    }), /Missing required property/);

  });


  it('process a dummy command where room must exist', () => {

    const processor = processorFactory({
      setUsername: {
        existingRoom: true, // This command handler expect an existing room
        fn: function () {
        }
      }
    }, {}, mockRoomsStore);

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'room-' + uuid(),
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    }), /Command setUsername only want's to get handled for an existing room/);

  });

});
