import {v4 as uuid} from 'uuid';

import {prepEmpty, prepOneUserInOneRoom} from '../testUtils';
import defaultCardConfig from '../../../src/defaultCardConfig';

test('nonexisting room', async () => {
  const {processor} = prepEmpty();

  const roomId = uuid();
  const commandId = uuid();
  const userId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'tester',
        email: 'super@test.com',
        avatar: 0 // 0 = currently the "anonymous" avatar.   0 as number is falsy, should still produce "avatarSet" event
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'roomCreated',
    'joinedRoom',
    'usernameSet',
    'emailSet',
    'avatarSet'
  );
  const [
    roomCreatedEvent,
    joinedRoomEvent,
    usernameSetEvent,
    emailSetEvent,
    avatarSetEvent
  ] = producedEvents;

  expect(roomCreatedEvent.userId).toEqual(userId);
  expect(roomCreatedEvent.payload).toEqual({});

  expect(joinedRoomEvent.userId).toEqual(userId);
  expect(joinedRoomEvent.payload).toEqual({
    stories: [],
    selectedStory: undefined,
    users: [
      {
        disconnected: false,
        id: userId,
        avatar: 0
      }
    ],
    cardConfig: defaultCardConfig, // default config is part of "joined" event payload, although it is not persisted on the room object (only if someone changes it with "setCardConfig")
    autoReveal: true
  });

  expect(usernameSetEvent.userId).toEqual(userId);
  expect(usernameSetEvent.payload).toEqual({
    username: 'tester'
  });

  expect(emailSetEvent.userId).toEqual(userId);
  expect(emailSetEvent.payload).toEqual({
    email: 'super@test.com',
    emailHash: '230016156266ce4617c6a181f81b6ee1'
  });

  expect(avatarSetEvent.userId).toEqual(userId);
  expect(avatarSetEvent.payload).toEqual({
    avatar: 0
  });

  // check room structure and data
  expect(room).toMatchObject({
    id: roomId,
    users: [
      {
        id: userId,
        avatar: 0,
        email: 'super@test.com',
        emailHash: '230016156266ce4617c6a181f81b6ee1',
        username: 'tester'
      }
    ],
    stories: [],
    autoReveal: true
    // and some timestamps properties: created, lastActivity
  });

  expect(room.cardConfig).toBeUndefined(); // do not store default card config on room

  // make sure that "pristine" flag is not persisted
  expect(room.pristine).toBeUndefined();
});

test('existing room with matching user already in room (re-join) ', async () => {
  const {processor, userId, roomId, mockRoomsStore} = await prepOneUserInOneRoom(
    'username-from-previous-join'
  );

  // simulate an "old" room that was created before #103
  mockRoomsStore.manipulate((room) => {
    room.cardConfig = undefined;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'tester', // command overrides already set username
        email: 'super@test.com',
        avatar: 0
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'joinedRoom',
    'usernameSet',
    'emailSet',
    'avatarSet'
  );
  const [joinedRoomEvent, usernameSetEvent, emailSetEvent, avatarSetEvent] = producedEvents;

  expect(joinedRoomEvent.userId).toEqual(userId);
  expect(joinedRoomEvent.payload).toEqual({
    stories: [],
    selectedStory: undefined,
    users: [
      {
        disconnected: false,
        email: 'super@test.com',
        id: userId,
        username: 'tester', // <- the payload of the join command takes precedence
        avatar: 0
      }
    ],
    cardConfig: defaultCardConfig,
    autoReveal: true
  });

  expect(usernameSetEvent.userId).toEqual(userId);
  expect(usernameSetEvent.payload).toEqual({
    username: 'tester'
  });

  expect(emailSetEvent.userId).toEqual(userId);
  expect(emailSetEvent.payload).toEqual({
    email: 'super@test.com',
    emailHash: '230016156266ce4617c6a181f81b6ee1'
  });

  expect(avatarSetEvent.userId).toEqual(userId);
  expect(avatarSetEvent.payload).toEqual({
    avatar: 0
  });

  // check room structure and data
  expect(room).toMatchObject({
    id: roomId,
    users: [
      {
        id: userId,
        avatar: 0,
        username: 'tester',
        email: 'super@test.com',
        emailHash: '230016156266ce4617c6a181f81b6ee1'
      }
    ],
    stories: []
    // and some timestamps properties: created, lastActivity
  });
});

test('existing room with user match, command has no preset properties', async () => {
  const {processor, userId, roomId, mockRoomsStore} = await prepOneUserInOneRoom(
    'custom-user-name'
  );

  mockRoomsStore.manipulate((room) => {
    room.users[0].email = 'super@test.com';
    room.users[0].avatar = 1;
    room.users[0].disconnected = true;
    return room;
  });

  const commandId = uuid();

  // user rejoins room
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        // no preset username, email, avatar (which is valid) (user has cleared local storage manually?)
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'joinedRoom',
    'usernameSet', // still usernameSet, emailSet and avatarSet should be produced, since backend "knows" user in this room and has stored these three properties
    'emailSet',
    'avatarSet'
  );
  const [joinedRoomEvent, usernameSetEvent, emailSetEvent, avatarSetEvent] = producedEvents;

  expect(joinedRoomEvent.userId).toEqual(userId);
  expect(joinedRoomEvent.payload).toEqual({
    stories: [],
    selectedStory: undefined,
    users: [
      {
        disconnected: false,
        email: 'super@test.com',
        id: userId,
        username: 'custom-user-name',
        avatar: 1
      }
    ],
    cardConfig: defaultCardConfig,
    autoReveal: true
  });

  expect(usernameSetEvent.userId).toEqual(userId);
  expect(usernameSetEvent.payload).toEqual({
    username: 'custom-user-name'
  });

  expect(emailSetEvent.userId).toEqual(userId);
  expect(emailSetEvent.payload).toEqual({
    email: 'super@test.com',
    emailHash: '230016156266ce4617c6a181f81b6ee1'
  });
  expect(avatarSetEvent.userId).toEqual(userId);
  expect(avatarSetEvent.payload).toEqual({
    avatar: 1
  });

  // check room structure and data
  expect(room).toMatchObject({
    id: roomId,
    users: [
      {
        id: userId,
        email: 'super@test.com',
        emailHash: '230016156266ce4617c6a181f81b6ee1',
        username: 'custom-user-name',
        avatar: 1
      }
    ],
    stories: []
    // and some timestamps properties: created, lastActivity
  });
});

test('space in custom room id', async () => {
  const {processor} = prepEmpty();

  const roomId = 'super team';
  const roomIdSanitized = 'super-team';

  const commandId = uuid();
  const userId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'tester',
        email: 'super@test.com'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomIdSanitized,
    'roomCreated',
    'joinedRoom',
    'usernameSet',
    'emailSet',
    'avatarSet'
  );
  const [roomCreatedEvent, joinedRoomEvent] = producedEvents;

  expect(roomCreatedEvent.roomId).toBe(roomIdSanitized);
  expect(joinedRoomEvent.roomId).toBe(roomIdSanitized);
  expect(room.id).toBe(roomIdSanitized);
});

test('existing room but completely new user, command has no preset properties', async () => {
  const {processor, userId, roomId} = await prepOneUserInOneRoom();

  // a new user joins room
  const commandId = uuid();
  const newUserId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        // no preset username, email, avatar (which is valid) (user has cleared local storage manually?)
      }
    },
    newUserId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'joinedRoom', 'avatarSet');
  const [joinedRoomEvent, avatarSetEvent] = producedEvents;

  expect(joinedRoomEvent.userId).toEqual(newUserId);
  expect(joinedRoomEvent.payload).toEqual({
    stories: [],
    selectedStory: undefined,
    users: [
      {
        id: userId,
        disconnected: false,
        username: 'firstUser',
        avatar: 0
      },
      {
        avatar: 0,
        disconnected: false,
        excluded: false,
        id: newUserId
      }
    ],
    cardConfig: defaultCardConfig,
    autoReveal: true
  });

  expect(avatarSetEvent.userId).toEqual(newUserId);
  expect(avatarSetEvent.payload).toEqual({
    avatar: 0 // the default
  });

  // check room structure and data
  expect(room).toMatchObject({
    id: roomId,
    users: [
      {
        id: userId,
        username: 'firstUser',
        avatar: 0
      },
      {
        id: newUserId,
        avatar: 0,
        disconnected: false,
        excluded: false
      }
    ],
    stories: []
    // and some timestamps properties: created, lastActivity
  });
});
