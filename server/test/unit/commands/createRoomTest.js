import assert from 'assert';
import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

describe('createRoom', () => {
  beforeEach(function () {
    this.userId = uuid();
    this.commandId = uuid();

    this.mockRoomsStore = testUtils.newMockRoomsStore();

    this.processor = processorFactory(commandHandlers, eventHandlers, this.mockRoomsStore);
  });

  it('should produce roomCreated & joinedRoom & usernameSet events', function () {
    return this.processor(
      {
        id: this.commandId,
        name: 'createRoom',
        payload: {
          userId: this.userId,
          username: 'something'
        }
      },
      this.userId
    ).then((producedEvents) => {
      assert(producedEvents);
      assert.equal(producedEvents.length, 3);

      const roomCreatedEvent = producedEvents[0];

      const roomId = roomCreatedEvent.roomId; // roomId is given by backend

      testUtils.assertValidEvent(
        roomCreatedEvent,
        this.commandId,
        roomId,
        this.userId,
        'roomCreated'
      );

      assert.equal(roomCreatedEvent.payload.userId, this.userId);
      assert.equal(roomCreatedEvent.payload.id, roomId);

      const joinedRoomEvent = producedEvents[1];
      testUtils.assertValidEvent(
        joinedRoomEvent,
        this.commandId,
        roomId,
        this.userId,
        'joinedRoom'
      );
      assert.equal(joinedRoomEvent.payload.userId, this.userId);
      assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
        id: this.userId,
        username: 'something'
      });

      const usernameSetEvent = producedEvents[2];
      testUtils.assertValidEvent(
        usernameSetEvent,
        this.commandId,
        roomId,
        this.userId,
        'usernameSet'
      );
      assert.equal(usernameSetEvent.payload.userId, this.userId);
      assert.equal(usernameSetEvent.payload.username, 'something');
    });
  });

  it('should produce roomCreated & joinedRoom events', function () {
    return this.processor(
      {
        id: this.commandId,
        name: 'createRoom',
        payload: {
          userId: this.userId
        }
      },
      this.userId
    ).then((producedEvents) => {
      assert(producedEvents);
      assert.equal(producedEvents.length, 2);

      const roomCreatedEvent = producedEvents[0];

      const roomId = roomCreatedEvent.roomId; // roomId is given by backend

      testUtils.assertValidEvent(
        roomCreatedEvent,
        this.commandId,
        roomId,
        this.userId,
        'roomCreated'
      );

      assert.equal(roomCreatedEvent.payload.userId, this.userId);
      assert.equal(roomCreatedEvent.payload.id, roomId);

      const joinedRoomEvent = producedEvents[1];
      testUtils.assertValidEvent(
        joinedRoomEvent,
        this.commandId,
        roomId,
        this.userId,
        'joinedRoom'
      );
      assert.equal(joinedRoomEvent.payload.userId, this.userId);
      assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
        id: this.userId,
        username: undefined
      });
    });
  });

  it('can create room with alias', function () {
    return this.processor(
      {
        id: this.commandId,
        name: 'createRoom',
        payload: {
          userId: this.userId,
          alias: 'super-group'
        }
      },
      this.userId
    ).then((producedEvents) => {
      assert(producedEvents);
      assert.equal(producedEvents.length, 2);

      const roomCreatedEvent = producedEvents[0];

      const roomId = roomCreatedEvent.roomId; // roomId is given by backend

      testUtils.assertValidEvent(
        roomCreatedEvent,
        this.commandId,
        roomId,
        this.userId,
        'roomCreated'
      );

      assert.equal(roomCreatedEvent.payload.userId, this.userId);
      assert.equal(roomCreatedEvent.payload.alias, 'super-group');
      assert.equal(roomCreatedEvent.payload.id, roomId);

      const joinedRoomEvent = producedEvents[1];
      testUtils.assertValidEvent(
        joinedRoomEvent,
        this.commandId,
        roomId,
        this.userId,
        'joinedRoom'
      );
      assert.equal(joinedRoomEvent.payload.userId, this.userId);
      assert.deepEqual(joinedRoomEvent.payload.users[this.userId], {
        id: this.userId,
        username: undefined
      });
      assert.equal(joinedRoomEvent.payload.alias, 'super-group');

      return this.mockRoomsStore.getRoomById(roomId).then((room) => {
        assert.equal(room.toJS().alias, 'super-group');
      });
    });
  });

  it('can create room with alias, alias will be lowercase', function () {
    return this.processor(
      {
        id: this.commandId,
        name: 'createRoom',
        payload: {
          userId: this.userId,
          alias: 'superAliasCamelCase'
        }
      },
      this.userId
    ).then((producedEvents) => {
      assert(producedEvents);
      assert.equal(producedEvents.length, 2);

      const roomCreatedEvent = producedEvents[0];
      assert.equal(roomCreatedEvent.payload.alias, 'superaliascamelcase'); // <<-  all lowercase
    });
  });
});
