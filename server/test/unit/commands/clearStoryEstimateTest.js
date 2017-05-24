import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('clearStoryEstimate', () => {

  beforeEach(function () {

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      users: {
        [this.userId]: {
          id: this.userId,
          username: 'Tester'
        },
        someoneElse: {
          id: 'someoneElse',
          username: 'John Doe'
        }
      }
    }));

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

    // add a story
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

  it('Should produce storyEstimateCleared event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const storyEstimateClearedEvent = producedEvents[0];
        testUtils.assertValidEvent(storyEstimateClearedEvent, this.commandId, this.roomId, this.userId, 'storyEstimateCleared');
        assert.equal(storyEstimateClearedEvent.payload.userId, this.userId);
        assert.equal(storyEstimateClearedEvent.payload.storyId, this.storyId);
      });

  });

  it('Should clear value', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId
      }
    }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['stories', this.storyId, 'estimations', this.userId]), undefined));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: 'unknown'
          }
        }, this.userId),
        'Can only clear estimate if userId in command payload matches!');
    });

    it('Should throw if storyId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: 'unknown',
            userId: this.userId
          }
        }, this.userId),
        'Can only clear estimation for currently selected story!');
    });

    it('Should throw if story already revealed', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['stories', this.storyId, 'revealed'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: this.userId
          }
        }, this.userId),
        'You cannot clear your estimate for a story that was revealed!');
    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: this.userId
          }
        }, this.userId), '' +
        'Visitors cannot clear estimations!');

    });


  });

});
