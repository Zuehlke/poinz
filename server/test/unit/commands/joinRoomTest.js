import {v4 as uuid} from 'uuid';

import {prepEmpty, prepOneUserInOneRoom} from '../testUtils';

test('nonexisting room', () => {
  const {processor} = prepEmpty();

  const roomId = uuid();
  const commandId = uuid();
  const userId = uuid();
  return processor(
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
  ).then(({producedEvents, room}) => {
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
      stories: {},
      selectedStory: undefined,
      users: {
        [userId]: {
          disconnected: false,
          email: 'super@test.com',
          id: userId,
          username: 'tester',
          avatar: 0
        }
      }
    });

    expect(usernameSetEvent.userId).toEqual(userId);
    expect(usernameSetEvent.payload).toEqual({
      username: 'tester'
    });

    expect(emailSetEvent.userId).toEqual(userId);
    expect(emailSetEvent.payload).toEqual({
      email: 'super@test.com'
    });

    expect(avatarSetEvent.userId).toEqual(userId);
    expect(avatarSetEvent.payload).toEqual({
      avatar: 0
    });

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId,
          avatar: 0,
          email: 'super@test.com',
          username: 'tester'
        }
      },
      stories: {}
      // and some timestamps properties: created, lastActivity
    });
  });
});

test('existing room with user match', async () => {
  const {processor, userId, roomId} = await prepOneUserInOneRoom();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'tester',
        email: 'super@test.com',
        avatar: 0
      }
    },
    userId
  ).then(({producedEvents, room}) => {
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
      stories: {},
      selectedStory: undefined,
      users: {
        [userId]: {
          disconnected: false,
          email: 'super@test.com',
          id: userId,
          username: 'tester',
          avatar: 0
        }
      }
    });

    expect(usernameSetEvent.userId).toEqual(userId);
    expect(usernameSetEvent.payload).toEqual({
      username: 'tester'
    });

    expect(emailSetEvent.userId).toEqual(userId);
    expect(emailSetEvent.payload).toEqual({
      email: 'super@test.com'
    });

    expect(avatarSetEvent.userId).toEqual(userId);
    expect(avatarSetEvent.payload).toEqual({
      avatar: 0
    });

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId,
          avatar: 0,
          username: 'tester',
          email: 'super@test.com'
        }
      },
      stories: {}
      // and some timestamps properties: created, lastActivity
    });
  });
});

test('existing room with user match, command has no preset properties', async () => {
  const {processor, userId, roomId, mockRoomsStore} = await prepOneUserInOneRoom(
    'custom-user-name'
  );

  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'email'], 'super@test.com'));
  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'avatar'], 1));
  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'disconnected'], true));

  const commandId = uuid();

  // user rejoins room
  return processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        // no preset username, email, avatar (which is totally valid)  e.g. first-time user
      }
    },
    userId
  ).then(({producedEvents, room}) => {
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
      stories: {},
      selectedStory: undefined,
      users: {
        [userId]: {
          disconnected: false,
          email: 'super@test.com',
          id: userId,
          username: 'custom-user-name',
          avatar: 1
        }
      }
    });

    expect(usernameSetEvent.userId).toEqual(userId);
    expect(usernameSetEvent.payload).toEqual({
      username: 'custom-user-name'
    });

    expect(emailSetEvent.userId).toEqual(userId);
    expect(emailSetEvent.payload).toEqual({
      email: 'super@test.com'
    });
    expect(avatarSetEvent.userId).toEqual(userId);
    expect(avatarSetEvent.payload).toEqual({
      avatar: 1
    });

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId,
          email: 'super@test.com',
          username: 'custom-user-name',
          avatar: 1
        }
      },
      stories: {}
      // and some timestamps properties: created, lastActivity
    });
  });
});
