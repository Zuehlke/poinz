const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('clearStoryEstimate', () => {

  beforeEach(function () {
    const cmdHandlers = handlerGatherer.gatherCommandHandlers();
    const evtHandlers = handlerGatherer.gatherEventHandlers();

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = commandTestUtils.newMockRoomsStore(Immutable.fromJS({
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

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);

    // add a story
    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 444',
        description: 'This will be awesome'
      }
    }, this.userId);

    this.storyId = producedEvents[0].payload.id;

    // select the story
    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'selectStory',
      payload: {
        storyId: this.storyId
      }
    }, this.userId);

    // store some estimations
    this.processor({
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

  it('Should produce storyEstimateCleared event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const storyEstimateClearedEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(storyEstimateClearedEvent, this.commandId, this.roomId, this.userId, 'storyEstimateCleared');
    assert.equal(storyEstimateClearedEvent.payload.userId, this.userId);
    assert.equal(storyEstimateClearedEvent.payload.storyId, this.storyId);

  });

  it('Should clear value', function () {

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId
      }
    }, this.userId);

    assert.equal(this.mockRoomsStore.getRoomById().getIn(['stories', this.storyId, 'estimations', this.userId]), undefined);
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {

      assert.throws(() => (
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: 'unknown'
          }
        }, this.userId)
      ), /Can only clear estimate if userId in command payload matches!/);

    });

    it('Should throw if storyId does not match', function () {

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'clearStoryEstimate',
        payload: {
          storyId: 'unknown',
          userId: this.userId
        }
      }, this.userId), /Can only clear estimation for currently selected story!/);

    });

    it('Should throw if story already revealed', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['stories', this.storyId, 'revealed'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'clearStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId
        }
      }, this.userId), /You cannot clear your estimate for a story that was revealed!/);

    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'clearStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId
        }
      }, this.userId), /Visitors cannot clear estimations!/);

    });


  });

});
