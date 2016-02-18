var
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  processorFactory = require('../src/commandProcessor');

describe('commandProcessor', () => {

  it('process a dummy command successfully', () => {

    var processor = processorFactory({
      takeOverWorld: {
        fn: function (room) {
          room.applyEvent('worldTaken', {});
        }
      }
    }, {
      worldTaken: function () {
        return new Immutable.Map();
      }
    });

    var producedEvents = processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'takeOverWorld',
      payload: {}
    });

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);
    assert.equal(producedEvents[0].name, 'worldTaken');
  });

  it('process a dummy command with No Handler', () => {

    var processor = processorFactory({
      // no command handlers
    }, {
      // no event handlers
    });

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'takeOverWorld',
      payload: {}
    }), /No handler found for takeOverWorld/);

  });

  it('process a dummy command where command handler produced unknown event', () => {

    var processor = processorFactory({
      takeOverWorld: {
        fn: function (room) {
          room.applyEvent('unknownEvent', {});
        }
      }
    }, {
      // no event handlers
    });

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'takeOverWorld',
      payload: {}
    }), /Cannot apply unknown event unknownEvent/);

  });

  it('process a dummy command where command precondition throws', () => {

    var processor = processorFactory({
      takeOverWorld: {
        preCondition: function () {
          throw new Error('Uh-uh. nono!');
        }
      }
    }, {
      // no event handlers
    });

    assert.throws(() => processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'takeOverWorld',
      payload: {}
    }), /Precondition Error during "takeOverWorld": Uh-uh. nono!/);
  });

  it('process a dummy command where command validation fails', () => {

    var processor = processorFactory({
      takeOverWorld: {}
    }, {
      // no event handlers
    });

    assert.throws(() => processor({
      // does not contain id
      roomId: 'my-test-room',
      name: 'takeOverWorld',
      payload: {}
    }), /Command validation Error during "takeOverWorld": Command must contain id/);

  });

});
