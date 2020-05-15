import assert from 'assert';
import {v4 as uuid} from 'uuid';
import Immutable from 'immutable';

import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';


describe('joinRoom', () => {

  beforeEach(function () {

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    // roomsStore is mocked so we can start with a clean slate and also manipulate state before tests
    this.mockRoomsStore = testUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      alias: 'custom.room.alias',
      users: {
        'user123': {
          id: 'user123',
          username: 'creator'
        }
      },
      stories: {
        'abc': {
          id: 'abc',
          title: 'some',
          estimations: {}
        }
      }
    }));


    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

  });

  it('Should produce 3 events for a already existing room', function () {

    return this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'joinRoom',
      payload: {
        userId: this.userId,
        email: 'j.doe@gmail.com',
        username: 'something'
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 3);

        const joinedRoomEvent = producedEvents[0];
        testUtils.assertValidEvent(joinedRoomEvent, this.commandId, this.roomId, this.userId, 'joinedRoom');
        assert.equal(joinedRoomEvent.payload.userId, this.userId);
        assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
          email: 'j.doe@gmail.com',
          id: this.userId,
          username: 'something'
        });

        const usernameSetEvent = producedEvents[1];
        testUtils.assertValidEvent(usernameSetEvent, this.commandId, this.roomId, this.userId, 'usernameSet');
        assert.equal(usernameSetEvent.payload.userId, this.userId);
        assert.equal(usernameSetEvent.payload.username, 'something');

        const emailSet = producedEvents[2];
        testUtils.assertValidEvent(emailSet, this.commandId, this.roomId, this.userId, 'emailSet');
        assert.equal(emailSet.payload.userId, this.userId);
        assert.equal(emailSet.payload.email, 'j.doe@gmail.com');

      });
  });


  it('Should be able to join room by alias', function () {

    return this.processor({
      id: this.commandId,
      roomId: 'custom-room-alias',  // <- this is not the roomId but the alias
      name: 'joinRoom',
      payload: {
        userId: this.userId,
        email: 'j.doe@gmail.com',
        username: 'something'
      }
    }, this.userId)
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 3);
      });
  });
});
