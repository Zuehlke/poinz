const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

/**
 * Can serve as a sample for command testing.
 *
 * Can test whether a given command produces expected events (validation + preconditions + event production)
 * Can test whether the produced events modify the room as expected (event handler functions)
 */
describe('addStory', () => {

  beforeEach(function () {
    // we want to test with real command- and event handlers!
    const cmdHandlers = handlerGatherer.gatherCommandHandlers();
    const evtHandlers = handlerGatherer.gatherEventHandlers();

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    // roomsStore is mocked so we can start with a clean slate and also manipulate state before tests
    this.mockRoomsStore = commandTestUtils.newMockRoomsStore(new Immutable.Map({
      id: this.roomId
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);
  });

  it('Should produce storyAdded event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const storyAddedEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(storyAddedEvent, this.commandId, this.roomId, this.userId, 'storyAdded');
    assert.equal(storyAddedEvent.payload.title, 'SuperStory 232');
    assert.equal(storyAddedEvent.payload.description, 'This will be awesome');
    assert.deepEqual(storyAddedEvent.payload.estimations, {});

  });

  it('Should store new story in room', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(this.mockRoomsStore.getRoomById().getIn(['stories', producedEvents[0].payload.id]), 'room must now contain added story');
  });

});
