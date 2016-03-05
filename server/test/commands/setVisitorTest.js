const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

describe('setVisitor', () => {


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

  });

  it('Should produce visitorSet event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: true
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const visitorSetEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorSet');
    assert.equal(visitorSetEvent.payload.userId, this.userId);

  });

  it('Should not produce event if already set', function () {

    this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: true
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 0);

  });

  it('Should produce visitorUnset event', function () {

    this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: false
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const visitorSetEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorUnset');
    assert.equal(visitorSetEvent.payload.userId, this.userId);

  });

  it('Should not produce event if already unset', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: false
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 0);

  });

  it('Should store flag on set', function () {

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: true
      }
    }, this.userId);

    assert.equal(this.mockRoomsStore.getRoomById().getIn(['users', this.userId, 'visitor']), true);
  });

  it('Should store flag on unset', function () {

    this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

    this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setVisitor',
      payload: {
        userId: this.userId,
        isVisitor: false
      }
    }, this.userId);

    assert.equal(this.mockRoomsStore.getRoomById().getIn(['users', this.userId, 'visitor']), false);
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'setVisitor',
        payload: {
          userId: 'unknown',
          isVisitor: true
        }
      }, this.userId), /Can only set visitor flag for own user!/);

    });
  });

});
