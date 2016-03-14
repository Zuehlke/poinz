const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('../commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('changeStory', () => {

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
        }
      }
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);

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

  it('Should produce storyChanged event', function () {

    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'changeStory',
        payload: {
          storyId: this.storyId,
          title: 'NewTitle',
          description: 'New Description'
        }
      }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const storyChangedEvent = producedEvents[0];
        commandTestUtils.assertValidEvent(storyChangedEvent, this.commandId, this.roomId, this.userId, 'storyChanged');
        assert.equal(storyChangedEvent.payload.storyId, this.storyId);
        assert.equal(storyChangedEvent.payload.title, 'NewTitle');
        assert.equal(storyChangedEvent.payload.description, 'New Description');
      });

  });

  it('Should store value', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'changeStory',
        payload: {
          storyId: this.storyId,
          title: 'NewTitle',
          description: 'New Description'
        }
      }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => {
        assert.equal(room.getIn(['stories', this.storyId, 'title']), 'NewTitle');
        assert.equal(room.getIn(['stories', this.storyId, 'description']), 'New Description');
      });
  });

  describe('preconditions', () => {

    it('Should throw if room does not contain matching story', function () {
      return commandTestUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'changeStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'NewTitle',
            description: 'New Description'
          }
        }, this.userId),
        'Cannot change unknown story some-unknown-story');
    });

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      return commandTestUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'changeStory',
          payload: {
            storyId: this.storyId,
            title: 'SuperStory 232',
            description: 'This will be awesome'
          }
        }, this.userId),
        'Visitors cannot change stories!');
    });


  });

});
