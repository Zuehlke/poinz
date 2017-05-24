import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import Promise from 'bluebird';
import testUtils from './testUtils';
import processorFactory from '../../src/commandProcessor';

describe('commandProcessor', () => {

  beforeEach(function () {
    this.mockRoomsStore = testUtils.newMockRoomsStore();
  });

  it('process a dummy command successfully', function () {

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
    }, this.mockRoomsStore);

    return processor({
      id: uuid(),
      roomId: 'my-test-room',
      name: 'setUsername',
      payload: {userId: 'abc', username: 'john'}
    })
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);
        assert.equal(producedEvents[0].name, 'usernameSet');
      });
  });

  it('process a dummy command with No Handler', function () {

    const processor = processorFactory({
      // no command handlers
    }, {
      // no event handlers
    }, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'my-test-room',
        name: 'setUsername',
        payload: {userId: 'abc', username: 'john'}
      }),
      'No command handler found for setUsername');
  });

  it('process a dummy command where command handler produced unknown event', function () {

    const processor = processorFactory({
      setUsername: {
        fn: function (room) {
          room.applyEvent('unknownEvent', {});
        }
      }
    }, {
      // no event handlers
    }, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'my-test-room',
        name: 'setUsername',
        payload: {userId: 'abc', username: 'john'}
      }),
      'Cannot apply unknown event unknownEvent');
  });

  it('process a dummy command where command precondition throws', function () {

    const processor = processorFactory({
      setUsername: {
        preCondition: function () {
          throw new Error('Uh-uh. nono!');
        }
      }
    }, {
      // no event handlers
    }, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'my-test-room',
        name: 'setUsername',
        payload: {userId: 'abc', username: 'john'}
      }),
      'Precondition Error during "setUsername": Uh-uh. nono!');
  });

  it('process a dummy command where command validation fails', function () {

    const processor = processorFactory({}, {}, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'my-test-room',
        // no name -> cannot load appropriate schema
        payload: {}
      }),
      'Command validation Error during "undefined": Command must contain a name');
  });

  it('process a dummy command where command validation fails (schema)', function () {

    const processor = processorFactory({}, {}, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'my-test-room',
        name: 'setUsername',
        payload: {}
      }),
      'Missing required property');
  });


  it('process a dummy command where room must exist', function () {
    const processor = processorFactory({
      setUsername: {
        existingRoom: true, // This command handler expect an existing room
        fn: function () {
        }
      }
    }, {}, this.mockRoomsStore);

    return testUtils.assertPromiseRejects(
      processor({
        id: uuid(),
        roomId: 'room-' + uuid(),
        name: 'setUsername',
        payload: {userId: 'abc', username: 'john'}
      }),
      'Command "setUsername" only want\'s to get handled for an existing room');
  });


  /**
   * Assures that we handle two "simultaneously" incoming commands correctly.
   */
  it('concurrency handling', function () {

    const mockRoomsStore = testUtils.newMockRoomsStore(new Immutable.Map({
      id: 'concurrencyTestRoom',
      manipulationCount: 0
    }));

    const processor = processorFactory({
      setUsername: {
        fn: function (room, command) {
          room.applyEvent('usernameSet', command.payload);
        }
      }
    }, {
      usernameSet: function (room, eventPayload) {
        return room
          .set('username', eventPayload.username)
          .set('manipulationCount', room.get('manipulationCount') + 1);
      }
    }, mockRoomsStore);

    const eventPromiseOne = processor({
      id: uuid(),
      roomId: 'concurrencyTestRoom',
      name: 'setUsername',
      payload: {userId: '1', username: 'tom'}
    });
    const eventPromiseTwo = processor({
      id: uuid(),
      roomId: 'concurrencyTestRoom',
      name: 'setUsername',
      payload: {userId: '1', username: 'jerry'}
    });

    return Promise.all([eventPromiseOne, eventPromiseTwo])
      .then(() => mockRoomsStore.getRoomById())
      .then(room => assert.equal(2, room.get('manipulationCount')));
  });

});
