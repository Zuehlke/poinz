import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('kick', () => {


  beforeEach(function () {

    this.userOneId = uuid();
    this.userTwoId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      stories: [],
      users: {
        [this.userOneId]: {
          id: this.userOneId
        },
        [this.userTwoId]: {
          id: this.userOneId,
          disconnected: true
        }
      }
    }));

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

  });

  it('Should produce kicked event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'kick',
      payload: {
        userId: this.userTwoId
      }
    }, this.userOneId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const kickedEvent = producedEvents[0];
        testUtils.assertValidEvent(kickedEvent, this.commandId, this.roomId, this.userOneId, 'kicked');
        assert.equal(kickedEvent.payload.userId, this.userTwoId);
      });
  });

  it('Should remove user from room', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'kick',
      payload: {
        userId: this.userTwoId
      }
    }, this.userOneId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert(!room.getIn(['users', this.userTwoId])));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match any user from the room', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'kick',
          payload: {
            userId: 'unknown'
          }
        }, this.userOneId),
        'Can only kick user that belongs to the same room!');
    });

    it('Should throw if tries to kick himself', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'kick',
          payload: {
            userId: this.userOneId
          }
        }, this.userOneId),
        'User cannot kick himself!');
    });


    it('Should throw if visitor tries to kick', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userOneId, 'visitor'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'kick',
          payload: {
            userId: this.userTwoId
          }
        }, this.userOneId),
        'Visitors cannot kick other users!');
    });
  });

});
