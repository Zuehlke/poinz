var
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('selectStory', () => {

  const cmdHandlers = handlerGatherer.gatherCommandHandlers();
  const evtHandlers = handlerGatherer.gatherEventHandlers();

  var room;

  const mockRoomsStore = {
    getRoomById: () => room,
    saveRoom: rm => room = rm
  };

  beforeEach(function () {
    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    room = new Immutable.Map({id: this.roomId});

    this.processor = processorFactory(cmdHandlers, evtHandlers, mockRoomsStore);

    // prepare the state with a story
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
  });

  it('Should produce storySelected event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'selectStory',
      payload: {
        storyId: this.storyId
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const storyAddedEvent = producedEvents[0];
    assert.equal(storyAddedEvent.correlationId, this.commandId);
    assert.equal(storyAddedEvent.name, 'storySelected');
    assert.equal(storyAddedEvent.roomId, this.roomId);
    assert.equal(storyAddedEvent.userId, this.userId);

  });

  it('Should store id of selectedStory', function () {

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'selectStory',
      payload: {
        storyId: this.storyId
      }
    }, this.userId);

    assert(room.get('selectedStory'), this.storyId);
  });

  describe('preconditions', ()=> {

    it('Should throw if story is not in room', function () {

      assert.throws(() => (
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'selectStory',
          payload: {
            storyId: 'story-not-in-room'
          }
        }, this.userId)
      ), /Precondition Error during "selectStory": Story story-not-in-room cannot be selected. It is not part of room/);

    });
  });

});
