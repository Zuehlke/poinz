import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('selectStory', () => {


  beforeEach(function () {

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(new Immutable.Map({
      id: this.roomId
    }));

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

    // prepare the state with a story
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 444',
        description: 'This will be awesome'
      }
    }, this.userId)
      .then(producedEvents => this.storyId = producedEvents[0].payload.id);
  });

  it('Should produce storySelected event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'selectStory',
      payload: {
        storyId: this.storyId
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const storySelectedEvent = producedEvents[0];
        testUtils.assertValidEvent(storySelectedEvent, this.commandId, this.roomId, this.userId, 'storySelected');
        assert.equal(storySelectedEvent.payload.storyId, this.storyId);
      });
  });

  it('Should store id of selectedStory', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'selectStory',
      payload: {
        storyId: this.storyId
      }
    }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.get('selectedStory'), this.storyId));
  });

  describe('preconditions', () => {

    it('Should throw if story is not in room', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'selectStory',
          payload: {
            storyId: 'story-not-in-room'
          }
        }, this.userId),
        'Precondition Error during "selectStory": Story story-not-in-room cannot be selected. It is not part of room');
    });

    it('Should throw if visitor tries to select current story', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'selectStory',
          payload: {
            storyId: this.storyId
          }
        }, this.userId),
        'Visitors cannot select current story!');
    });

  });

});
