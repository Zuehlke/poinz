var
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

/**
 * Can serve as a sample for command testing.
 *
 * Can test whether a given command produces expected events (validation + preconditions + event production)
 * Can test whether the produced events modify the room as expected (event handler functions)
 */
describe('addStory', () => {

  const cmdHandlers = handlerGatherer.gatherCommandHandlers();
  const evtHandlers = handlerGatherer.gatherEventHandlers();

  var existingRoom, savedRoom;

  const mockRoomsStore = {
    getRoomById: () => existingRoom,
    saveRoom: room => savedRoom = room
  };

  beforeEach(function () {
    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();
  });

  it('Should produce storyAdded event', function () {

    existingRoom = new Immutable.Map({id: this.roomId});

    const processor = processorFactory(cmdHandlers, evtHandlers, mockRoomsStore);

    const producedEvents = processor({
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
    assert.equal(storyAddedEvent.correlationId, this.commandId);
    assert.equal(storyAddedEvent.name, 'storyAdded');
    assert.equal(storyAddedEvent.roomId, this.roomId);
    assert.equal(storyAddedEvent.userId, this.userId);
    assert.equal(storyAddedEvent.payload.title, 'SuperStory 232');
    assert.equal(storyAddedEvent.payload.description, 'This will be awesome');
    assert.deepEqual(storyAddedEvent.payload.estimations, {});

  });

  it('Should store new story in room', function () {

    existingRoom = new Immutable.Map({id: this.roomId});

    const processor = processorFactory(cmdHandlers, evtHandlers, mockRoomsStore);

    const producedEvents = processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(savedRoom.getIn(['stories', producedEvents[0].payload.id]), 'room must now contain added story');
  });

});
