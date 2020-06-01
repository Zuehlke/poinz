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

    expect(kickedEvent.payload.userId).toEqual(userIdTwo);

    // user is removed from room
    expect(room.users[userIdTwo]).toBeUndefined();
  });
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
            userId: 'unknown'
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

  test('Should throw if tries to kick user that is not disconnected', async () => {
    const {roomId, userIdOne, userIdTwo, processor} = await prepTwoUsersInOneRoomWithOneStory();
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
        userIdTwo
      )
    ).rejects.toThrow('Precondition Error during "kick": Can only kick disconnected users!');
  });

  test('Should throw if visitor tries to kick', async () => {
    const {
      roomId,
      userIdOne,
      userIdTwo,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();

    mockRoomsStore.manipulate((room) => room.setIn(['users', userIdTwo, 'disconnected'], true));

    mockRoomsStore.manipulate((room) => room.setIn(['users', userIdOne, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: userIdTwo
          }
        },
        userIdOne
      )
    ).rejects.toThrow('Visitors cannot kick other users!');
  });
});
