import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';


describe('setEmail', () => {


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

  it('Should produce emailSet event', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setEmail',
      payload: {
        userId: this.userId,
        email: 'j.doe@gmail.com'
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 1);

        const emailSetEvent = producedEvents[0];
        testUtils.assertValidEvent(emailSetEvent, this.commandId, this.roomId, this.userId, 'emailSet');
        assert.equal(emailSetEvent.payload.email, 'j.doe@gmail.com');
        assert.equal(emailSetEvent.payload.userId, this.userId);
      });
  });

  it('Should store email', function () {
    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'setEmail',
      payload: {
        userId: this.userId,
        email: 'mikey.mouse@hotmail.com'
      }
    }, this.userId)
      .then(() => this.mockRoomsStore.getRoomById())
      .then(room => assert.equal(room.getIn(['users', this.userId, 'email']), 'mikey.mouse@hotmail.com'));
  });

  describe('preconditions', () => {

    it('Should throw if userId does not match', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setEmail',
          payload: {
            userId: 'unknown',
            email: 'm.mouse@gmail.com'
          }
        }, this.userId),
        'Can only set email for own user!');
    });

    it('Should throw if given email does not match format', function () {
      return testUtils.assertPromiseRejects(
        this.processor({
          id: this.commandId,
          roomId: this.roomId,
          name: 'setEmail',
          payload: {
            userId: this.userId,
            email: 'this.is not a email'
          }
        }, this.userId),
        'Format validation failed (must be a valid email-address) in /payload/email');
    });

  });

});
