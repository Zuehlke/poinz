const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('reveal', () => {

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
          id: this.userId
        }
      }
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);

    // add story to room
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

  it('Should produce revealed event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'reveal',
      payload: {
        storyId: this.storyId
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const revealedEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(revealedEvent, this.commandId, this.roomId, this.userId, 'revealed');
    assert.equal(revealedEvent.payload.storyId, this.storyId);
    assert.equal(revealedEvent.payload.manually, true);

  });

  it('Should set "revealed" flag', function () {

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'reveal',
      payload: {
        storyId: this.storyId
      }
    }, this.userId);

    assert.equal(this.mockRoomsStore.getRoomById().getIn(['stories', this.storyId, 'revealed']), true);
  });

  describe('preconditions', () => {

    it('Should throw if storyId does not match currently selected story', function () {

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'reveal',
        payload: {
          storyId: 'anotherStory'
        }
      }, this.userId), /Can only reveal currently selected story!/);

    });

    it('Should throw if user is visitor', function () {

      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'reveal',
        payload: {
          storyId: this.storyId
        }
      }, this.userId), /Visitors cannot reveal stories!/);

    });


  });

});
