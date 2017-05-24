import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('giveStoryEstimate', () => {

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

    // prepare the state with a story (you could this directly on the state, but this is closer to reality)
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
      });


  });

  it('Should produce storyEstimateGiven event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId,
        value: 2
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const storyEstimatgeGivenEvent = producedEvents[0];
        testUtils.assertValidEvent(storyEstimatgeGivenEvent, this.commandId, this.roomId, this.userId, 'storyEstimateGiven');
        assert.equal(storyEstimatgeGivenEvent.payload.userId, this.userId);
        assert.equal(storyEstimatgeGivenEvent.payload.storyId, this.storyId);
        assert.equal(storyEstimatgeGivenEvent.payload.value, 2);
      });

  });

  it('Should store value', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId,
        value: 2
      }
    }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['stories', this.storyId, 'estimations', this.userId]), 2));
  });

  describe('with additional "revealed" event', () => {

    it('Should produce additional "revealed" event if all users estimated (only one user)', function () {
      this.mockRoomsStore.manipulate(room => room.removeIn(['users', 'someoneElse']));
      return handleCommandAndAssertRevealed.call(this);
    });

    it('Should produce additional "revealed" event if all users estimated (other user is visitor)', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', 'someoneElse', 'visitor'], true));
      return handleCommandAndAssertRevealed.call(this);
    });

    function handleCommandAndAssertRevealed() {
      return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId,
          value: 2
        }
      }, this.userId)
        .then(producedEvents => {
          assert(producedEvents);
          assert.equal(producedEvents.length, 2);

          const storyEstimatgeGivenEvent = producedEvents[0];
          testUtils.assertValidEvent(storyEstimatgeGivenEvent, this.commandId, this.roomId, this.userId, 'storyEstimateGiven');

          const revealedEvent = producedEvents[1];
          testUtils.assertValidEvent(revealedEvent, this.commandId, this.roomId, this.userId, 'revealed');
          assert.equal(revealedEvent.payload.manually, false);
          assert.equal(revealedEvent.payload.storyId, this.storyId);
        });

    }
  });


  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: 'unknown',
            value: 2
          }
        }, this.userId),
        'Can only give estimate if userId in command payload matches');
    });

    it('Should throw if storyId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: 'unknown',
            userId: this.userId,
            value: 2
          }
        }, this.userId),
        'Can only give estimation for currently selected story!');
    });

    it('Should throw if story already revealed', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['stories', this.storyId, 'revealed'], true));
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: this.userId,
            value: 2
          }
        }, this.userId),
        'You cannot give an estimate for a story that was revealed!');
    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: this.userId,
            value: 2
          }
        }, this.userId),
        'Visitors cannot give estimations!');
    });


  });

});
