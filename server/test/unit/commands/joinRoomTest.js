import assert from 'assert';
import {v4 as uuid} from 'uuid';
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

    this.mockRoomsStore = testUtils.newMockRoomsStore();

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);

  });

  it('Should produce 4 events for a non-existing room', function () {
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
        assert.equal(producedEvents.length, 4);

        const roomCreatedEvent = producedEvents[0];
        testUtils.assertValidEvent(roomCreatedEvent, this.commandId, this.roomId, this.userId, 'roomCreated');
        assert.equal(roomCreatedEvent.payload.userId, this.userId);
        assert.equal(roomCreatedEvent.payload.id, this.roomId);

        const joinedRoomEvent = producedEvents[1];
        testUtils.assertValidEvent(joinedRoomEvent, this.commandId, this.roomId, this.userId, 'joinedRoom');
        assert.equal(joinedRoomEvent.payload.userId, this.userId);
        assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
          id: this.userId,
          username: 'something'
        });

        const usernameSetEvent = producedEvents[2];
        testUtils.assertValidEvent(usernameSetEvent, this.commandId, this.roomId, this.userId, 'usernameSet');
        assert.equal(usernameSetEvent.payload.userId, this.userId);
        assert.equal(usernameSetEvent.payload.username, 'something');


        const emailSet = producedEvents[3];
        testUtils.assertValidEvent(emailSet, this.commandId, this.roomId, this.userId, 'emailSet');
        assert.equal(emailSet.payload.userId, this.userId);
        assert.equal(emailSet.payload.email, 'j.doe@gmail.com');

      });
  });

  it('Should produce 3 events for a already existing room', function () {
    const userOne = uuid();

    return this.processor({
      // first another user creates the room
      id: uuid(),
      roomId: this.roomId,
      name: 'joinRoom',
      payload: {
        userId: userOne
      }
    }, userOne)
      .then(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'joinRoom',
        payload: {
          userId: this.userId,
          email: 'j.doe@gmail.com',
          username: 'something'
        }
      }, this.userId))
      .then(producedEvents => {
        assert(producedEvents);
        assert.equal(producedEvents.length, 3);

        const joinedRoomEvent = producedEvents[0];
        testUtils.assertValidEvent(joinedRoomEvent, this.commandId, this.roomId, this.userId, 'joinedRoom');
        assert.equal(joinedRoomEvent.payload.userId, this.userId);
        assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
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


});
