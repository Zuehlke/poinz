import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('newEstimationRound', () => {

  beforeEach(function () {

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      users: {
        [this.userId]: {
          id: this.userId
        }
      }
    }));

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

    // add story to room
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 444',
        description: 'This will be awesome'
      }
    }, this.userId)
      .then(producedEvents => {

        this.storyId = producedEvents[0].payload.id;

        // select the story
        return this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'selectStory',
          payload: {
            storyId: this.storyId
          }
        }, this.userId);
      })
      .then(() => {
        // store some estimations
        return this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            userId: this.userId,
            storyId: this.storyId,
            value: 8
          }
        }, this.userId);
      });
  });

  it('Should produce newEstimationRoundStarted event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'newEstimationRound',
      payload: {
        storyId: this.storyId
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const newRoundStartedEvent = producedEvents[0];
        testUtils.assertValidEvent(newRoundStartedEvent, this.commandId, this.roomId, this.userId, 'newEstimationRoundStarted');
        assert.equal(newRoundStartedEvent.payload.storyId, this.storyId);
      });
  });

  it('Should clear estimations', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'newEstimationRound',
      payload: {
        storyId: this.storyId
      }
    }, this.userId)
      .then(() =>this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['stories', this.storyId, 'estimations']).size, 0));
  });

  it('Should clear "revealed" flag', function () {

    this.mockRoomsStore.manipulate(room => room.setIn(['stories', this.storyId, 'revealed'], true));

    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'newEstimationRound',
      payload: {
        storyId: this.storyId
      }
    }, this.userId)
      .then(() =>this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['stories', this.storyId, 'revealed']), false));
  });

  describe('preconditions', () => {

    it('Should throw if storyId does not match currently selected story', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'newEstimationRound',
          payload: {
            storyId: 'anotherStory'
          }
        }, this.userId),
        'Can only start a new round for currently selected story!');
    });
  });

});
