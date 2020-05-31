import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('should produce roomCreated & joinedRoom & usernameSet events', async () => {
  const {userId, processor} = prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId: userId,
        username: 'something'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(3);

    const roomCreatedEvent = producedEvents[0];

    const roomId = roomCreatedEvent.roomId; // roomId is given by backend

    testUtils.assertValidEvent(roomCreatedEvent, commandId, roomId, userId, 'roomCreated');

    expect(roomCreatedEvent.payload.userId).toEqual(userId);
    expect(roomCreatedEvent.payload.id).toEqual(roomId);

    const joinedRoomEvent = producedEvents[1];
    testUtils.assertValidEvent(joinedRoomEvent, commandId, roomId, userId, 'joinedRoom');
    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      id: userId,
      username: 'something'
    });

    const usernameSetEvent = producedEvents[2];
    testUtils.assertValidEvent(usernameSetEvent, commandId, roomId, userId, 'usernameSet');
    expect(usernameSetEvent.payload.userId).toEqual(userId);
    expect(usernameSetEvent.payload.username).toEqual('something');
  });
});

test('should produce roomCreated & joinedRoom events', async () => {
  const {userId, processor} = prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId: userId
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(2);

    const roomCreatedEvent = producedEvents[0];

    const roomId = roomCreatedEvent.roomId; // roomId is given by backend

    testUtils.assertValidEvent(roomCreatedEvent, commandId, roomId, userId, 'roomCreated');

    expect(roomCreatedEvent.payload.userId).toEqual(userId);
    expect(roomCreatedEvent.payload.id).toEqual(roomId);

    const joinedRoomEvent = producedEvents[1];
    testUtils.assertValidEvent(joinedRoomEvent, commandId, roomId, userId, 'joinedRoom');
    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      id: userId,
      username: undefined
    });
  });
});

test('can create room with alias', async () => {
  const {userId, processor, mockRoomsStore} = prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId,
        alias: 'super-group'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(2);

    const roomCreatedEvent = producedEvents[0];

    const roomId = roomCreatedEvent.roomId; // roomId is given by backend

    testUtils.assertValidEvent(roomCreatedEvent, commandId, roomId, userId, 'roomCreated');

    expect(roomCreatedEvent.payload.userId).toEqual(userId);
    expect(roomCreatedEvent.payload.alias).toEqual('super-group');
    expect(roomCreatedEvent.payload.id).toEqual(roomId);

    const joinedRoomEvent = producedEvents[1];
    testUtils.assertValidEvent(joinedRoomEvent, commandId, roomId, userId, 'joinedRoom');
    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      id: userId,
      username: undefined
    });
    expect(joinedRoomEvent.payload.alias).toEqual('super-group');

    return mockRoomsStore
      .getRoomById(roomId)
      .then((room) => expect(room.toJS().alias).toEqual('super-group'));
  });
});

test('can create room with alias, alias will be lowercase', async () => {
  const {userId, processor} = prep();
  return processor(
    {
      id: uuid(),
      name: 'createRoom',
      payload: {
        userId,
        alias: 'superAliasCamelCase'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(2);

    const roomCreatedEvent = producedEvents[0];
    expect(roomCreatedEvent.payload.alias).toEqual('superaliascamelcase'); // <<-  all lowercase
  });
});

function prep() {
  const userId = uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore();

  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return {userId, mockRoomsStore, processor};
}
