import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('deleteStory', () => {

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
      .then(producedEvents => this.storyId = producedEvents[0].payload.id);
  });

  it('Should produce storyDeleted event', function () {

    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'deleteStory',
      payload: {
        storyId: this.storyId,
        title: 'SuperStory 444'
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const storyDeletedEvent = producedEvents[0];
        testUtils.assertValidEvent(storyDeletedEvent, this.commandId, this.roomId, this.userId, 'storyDeleted');
        assert.equal(storyDeletedEvent.payload.storyId, this.storyId);
        assert.equal(storyDeletedEvent.payload.title, 'SuperStory 444');
      });

  });

  it('Should delete story', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'deleteStory',
      payload: {
        storyId: this.storyId,
        title: 'SuperStory 444'
      }
    }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => {
        assert.equal(room.getIn(['stories', this.storyId]), undefined);
      });
  });

  describe('preconditions', () => {

    it('Should throw if room does not contain matching story', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'deleteStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'SuperStory 444'
          }
        }, this.userId),
        'Cannot delete unknown story some-unknown-story');
    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'deleteStory',
          payload: {
            storyId: this.storyId,
            title: 'SuperStory 444'
          }
        }, this.userId),
        'Visitors cannot delete stories!');
    });


  });

});
