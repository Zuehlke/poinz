import {v4 as uuid} from 'uuid';
import {assertEvents,  prepEmpty} from '../testUtils';

test('should produce roomCreated / joinedRoom / usernameSet / emailSet events', async () => {
  const {processor} = prepEmpty();
  const commandId = uuid();
  const userId = uuid();
  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId: userId,
        username: 'something',
        email: 'preset.email@test.com'
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    const roomId = producedEvents[0].roomId; // roomId is given by backend

    const [roomCreatedEvent, joinedRoomEvent, usernameSetEvent, emailSetEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'roomCreated',
      'joinedRoom',
      'usernameSet',
      'emailSet'
    );

    expect(roomCreatedEvent.payload.userId).toEqual(userId);
    expect(roomCreatedEvent.payload.id).toEqual(roomId);

    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      id: userId,
      username: 'something'
    });

    expect(usernameSetEvent.payload.userId).toEqual(userId);
    expect(usernameSetEvent.payload.username).toEqual('something');

    expect(emailSetEvent.payload.userId).toEqual(userId);
    expect(emailSetEvent.payload.email).toEqual('preset.email@test.com');

    expect(room.users[userId]).toEqual({
      email: 'preset.email@test.com',
      id: userId,
      username: 'something'
    });
  });
});

test('should produce roomCreated & joinedRoom events', async () => {
  const {processor} = prepEmpty();
  const commandId = uuid();
  const userId = uuid();

  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId: userId
      }
    },
    userId
  ).then(({producedEvents}) => {
    const roomId = producedEvents[0].roomId; // roomId is given by backend

    const [roomCreatedEvent, joinedRoomEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'roomCreated',
      'joinedRoom'
    );

    expect(roomCreatedEvent.payload.userId).toEqual(userId);
    expect(roomCreatedEvent.payload.id).toEqual(roomId);

    expect(joinedRoomEvent.payload.userId).toEqual(userId);
    expect(joinedRoomEvent.payload.users[userId]).toEqual({
      id: userId,
      username: undefined
    });
  });
});

test('can create room with alias', async () => {
  const {processor, mockRoomsStore} = prepEmpty();
  const commandId = uuid();
  const userId = uuid();

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
  ).then(({producedEvents}) => {
    const roomId = producedEvents[0].roomId; // roomId is given by backend

    const [roomCreatedEvent, joinedRoomEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'roomCreated',
      'joinedRoom'
    );

    expect(roomCreatedEvent.payload).toEqual({
      userId,
      alias: 'super-group',
      id: roomId
    });

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
  const {processor} = prepEmpty();
  const userId = uuid();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      name: 'createRoom',
      payload: {
        userId,
        alias: 'superAliasCamelCase'
      }
    },
    userId
  ).then(({producedEvents}) => {
    const roomId = producedEvents[0].roomId;
    const [roomCreatedEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'roomCreated',
      'joinedRoom'
    );

    expect(roomCreatedEvent.payload.alias).toEqual('superaliascamelcase'); // <<-  all lowercase
  });
});
