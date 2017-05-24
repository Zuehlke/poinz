import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('setVisitor', () => {


  beforeEach(function () {

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      users: {
        [this.userId]: {
          id: this.userId
        }
      }
    }));

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

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
          testUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorSet');
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
          testUtils.assertValidEvent(visitorSetEvent, this.commandId, this.roomId, this.userId, 'visitorUnset');
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
      return testUtils.assertPromiseRejects(
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
