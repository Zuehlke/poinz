import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce kicked event (userOne kicks disconnected userTwo)', async () => {
  const {
    roomId,
    userIdOne,
    userIdTwo,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => room.setIn(['users', userIdTwo, 'disconnected'], true));

  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked');

    const [kickedEvent] = producedEvents;

    expect(kickedEvent.userId).toEqual(userIdOne); // the user that kicked
    expect(kickedEvent.payload.userId).toEqual(userIdTwo); // user that was kicked

    // user is removed from room
    expect(room.users[userIdTwo]).toBeUndefined();
  });
});

test('Should produce kicked event for connected (i.e. normal) user', async () => {
  const {roomId, userIdOne, userIdTwo, processor} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked');

    const [kickedEvent] = producedEvents;

    expect(kickedEvent.userId).toEqual(userIdOne); // the user that kicked
    expect(kickedEvent.payload.userId).toEqual(userIdTwo); // user that was kicked

    // user is removed from room
    expect(room.users[userIdTwo]).toBeUndefined();
  });
});

test('Users that are marked as excluded can also kick others (userOne [excluded]  kicks disconnected userTwo)', async () => {
  const {
    roomId,
    userIdOne,
    userIdTwo,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => room.setIn(['users', userIdTwo, 'disconnected'], true));
  mockRoomsStore.manipulate((room) => room.setIn(['users', userIdOne, 'excluded'], true));

  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  ).then(({producedEvents}) => expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked'));
});

describe('preconditions', () => {
  test('Should throw if userId does not match any user from the room', async () => {
    const {roomId, userIdOne, processor} = await prepTwoUsersInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: uuid() // new random userId, not part of our room
          }
        },
        userIdOne
      )
    ).rejects.toThrow('Can only kick user that belongs to the same room!');
  });

  test('Should throw if tries to kick himself', async () => {
    const {roomId, userIdOne, processor} = await prepTwoUsersInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: userIdOne
          }
        },
        userIdOne
      )
    ).rejects.toThrow('User cannot kick himself!');
  });
});
