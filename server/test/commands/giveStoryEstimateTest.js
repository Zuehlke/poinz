const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('giveStoryEstimate', () => {

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

    // prepare the state with a story (you could this directly on the state, but this is closer to reality)
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

  });

  it('Should produce storyEstimateGiven event', function () {
    assert.equal(this.mockRoomsStore.getRoomById().get('users').size, 2);

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId,
        value: 2
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const storyEstimatgeGivenEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(storyEstimatgeGivenEvent, this.commandId, this.roomId, this.userId, 'storyEstimateGiven');
    assert.equal(storyEstimatgeGivenEvent.payload.userId, this.userId);
    assert.equal(storyEstimatgeGivenEvent.payload.storyId, this.storyId);
    assert.equal(storyEstimatgeGivenEvent.payload.value, 2);

  });

  it('Should store value', function () {

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: this.storyId,
        userId: this.userId,
        value: 2
      }
    }, this.userId);

    assert.equal(this.mockRoomsStore.getRoomById().getIn(['stories', this.storyId, 'estimations', this.userId]), 2);
  });

  describe('with additional "revealed" event', () => {

    it('Should produce additional "revealed" event if all users estimated (only one user)', function () {
      assert.equal(this.mockRoomsStore.getRoomById().get('users').size, 2);
      this.mockRoomsStore.manipulate(room => room.removeIn(['users', 'someoneElse']));
      handleCommandAndAssertRevealed.call(this);
    });

    it('Should produce additional "revealed" event if all users estimated (other user is visitor)', function () {
      assert.equal(this.mockRoomsStore.getRoomById().get('users').size, 2);
      this.mockRoomsStore.manipulate(room => room.setIn(['users', 'someoneElse', 'visitor'], true));
      handleCommandAndAssertRevealed.call(this);
    });

    function handleCommandAndAssertRevealed() {
      const producedEvents = this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId,
          value: 2
        }
      }, this.userId);

      assert(producedEvents);
      assert.equal(producedEvents.length, 2);

      const storyEstimatgeGivenEvent = producedEvents[0];
      commandTestUtils.assertValidEvent(storyEstimatgeGivenEvent, this.commandId, this.roomId, this.userId, 'storyEstimateGiven');

      const revealedEvent = producedEvents[1];
      commandTestUtils.assertValidEvent(revealedEvent, this.commandId, this.roomId, this.userId, 'revealed');
      assert.equal(revealedEvent.payload.manually, false);
      assert.equal(revealedEvent.payload.storyId, this.storyId);
    }
  });


  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {

      assert.throws(() => (
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: this.storyId,
            userId: 'unknown',
            value: 2
          }
        }, this.userId)
      ), /Can only give estimate if userId in command payload matches/);

    });

    it('Should throw if storyId does not match', function () {

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: 'unknown',
          userId: this.userId,
          value: 2
        }
      }, this.userId), /Can only give estimation for currently selected story!/);

    });

    it('Should throw if story already revealed', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['stories', this.storyId, 'revealed'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId,
          value: 2
        }
      }, this.userId), /You cannot give an estimate for a story that was revealed!/);

    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: this.storyId,
          userId: this.userId,
          value: 2
        }
      }, this.userId), /Visitors cannot give estimations!/);

    });


  });

});
