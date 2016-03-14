const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('../commandTestUtils'),
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

  describe('visitorSet', function () {

    it('Should produce visitorSet event', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], false));
      return handleCommandAndAssert.call(this);
    });

    it('Should also produce event if already set (event is idempotent anyways)', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));
      return handleCommandAndAssert.call(this);
    });

    function handleCommandAndAssert() {
      return this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setVisitor',
          payload: {
            userId: this.userId,
            isVisitor: true
          }
        }, this.userId)
        .then(producedEvents => {
          assert(producedEvents);
          assert.equal(producedEvents.length, 1);

          const visitorSetEvent = producedEvents[0];
          commandTestUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorSet');
          assert.equal(visitorSetEvent.payload.userId, this.userId);
        });
    }
  });


  describe('visitorUnset', function () {

    it('Should produce visitorUnset event', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));
      return handleCommandAndAssert.call(this);
    });

    it('Should also produce event if already unset (event is idempotent anyways)', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], false));
      return handleCommandAndAssert.call(this);
    });

    function handleCommandAndAssert() {
      return this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setVisitor',
          payload: {
            userId: this.userId,
            isVisitor: false
          }
        }, this.userId)
        .then(producedEvents => {
          assert(producedEvents);
          assert.equal(producedEvents.length, 1);

          const visitorSetEvent = producedEvents[0];
          commandTestUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorUnset');
          assert.equal(visitorSetEvent.payload.userId, this.userId);
        });
    }

  });


  it('Should store flag on set', function () {
    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'setVisitor',
        payload: {
          userId: this.userId,
          isVisitor: true
        }
      }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['users', this.userId, 'visitor']), true));
  });

  it('Should store flag on unset', function () {
    this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

    return this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'setVisitor',
        payload: {
          userId: this.userId,
          isVisitor: false
        }
      }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['users', this.userId, 'visitor']), false));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {
      return commandTestUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setVisitor',
          payload: {
            userId: 'unknown',
            isVisitor: true
          }
        }, this.userId),
        'Can only set visitor flag for own user!');
    });
  });

});
