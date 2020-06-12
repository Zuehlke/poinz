import {v4 as uuid} from 'uuid';

import {prepEmpty, prepOneUserInOneRoom} from '../testUtils';

test('nonexisting room  ', () => {
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
        email: 'super@test.com'
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
      'emailSet'
    );
    const [roomCreatedEvent, joinedRoomEvent, usernameSetEvent, emailSetEvent] = producedEvents;

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
          username: 'tester'
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

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId
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
        email: 'super@test.com'
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(
      commandId,
      roomId,
      'joinedRoom',
      'usernameSet',
      'emailSet'
    );
    const [joinedRoomEvent, usernameSetEvent, emailSetEvent] = producedEvents;

    expect(joinedRoomEvent.userId).toEqual(userId);
    expect(joinedRoomEvent.payload).toEqual({
      stories: {},
      selectedStory: undefined,
      users: {
        [userId]: {
          disconnected: false,
          email: 'super@test.com',
          id: userId,
          username: 'tester'
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

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId
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
  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'disconnected'], true));

  const commandId = uuid();

  // user rejoins room
  return processor(
    {
      id: commandId,
      roomId,
      name: 'joinRoom',
      payload: {
        // for some reason, no preset username and email (which is totally valid)
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(
      commandId,
      roomId,
      'joinedRoom',
      'usernameSet', // still usernameSet and emailSet should be produced, since backend "knows" user in this room and has stored these two properties
      'emailSet'
    );
    const [joinedRoomEvent, usernameSetEvent, emailSetEvent] = producedEvents;

    expect(joinedRoomEvent.userId).toEqual(userId);
    expect(joinedRoomEvent.payload).toEqual({
      stories: {},
      selectedStory: undefined,
      users: {
        [userId]: {
          disconnected: false,
          email: 'super@test.com',
          id: userId,
          username: 'custom-user-name'
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

    // check room structure and data
    expect(room).toMatchObject({
      id: roomId,
      users: {
        [userId]: {
          id: userId
        }
      },
      stories: {}
      // and some timestamps properties: created, lastActivity
    });
  });
});
