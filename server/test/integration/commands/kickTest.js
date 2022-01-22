import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';
import uuid from '../../../src/uuid';

test('Should produce kicked event (userOne kicks disconnected userTwo)', async () => {
  const {roomId, userIdOne, userIdTwo, processor, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[1].disconnected = true;
    return room;
  });

  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked');

  const [kickedEvent] = producedEvents;

  expect(kickedEvent.userId).toEqual(userIdOne); // the user that kicked
  expect(kickedEvent.payload.userId).toEqual(userIdTwo); // user that was kicked

  // user is removed from room
  expect(room.users[userIdTwo]).toBeUndefined();
});

test('Should produce kicked event for connected (i.e. normal) user', async () => {
  const {roomId, userIdOne, userIdTwo, processor} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked');

  const [kickedEvent] = producedEvents;

  expect(kickedEvent.userId).toEqual(userIdOne); // the user that kicked
  expect(kickedEvent.payload.userId).toEqual(userIdTwo); // user that was kicked

  // user is removed from room
  expect(room.users[userIdTwo]).toBeUndefined();
});

test('Users that are marked as excluded can also kick others (userOne [excluded]  kicks disconnected userTwo)', async () => {
  const {roomId, userIdOne, userIdTwo, processor, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[1].disconnected = true;
    room.users[0].excluded = true;
    return room;
  });

  const commandId = uuid();

  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'kick',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'kicked');
});

describe('preconditions', () => {
  test('Should throw if userId does not match any user from the room', async () => {
    const {roomId, userIdOne, processor} = await prepTwoUsersInOneRoomWithOneStory();
    const userToKick = uuid(); // new random userId, not part of our room
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'kick',
          payload: {
            userId: userToKick
          }
        },
        userIdOne
      )
    ).rejects.toThrow(`Given user ${userToKick} does not belong to room ${roomId}`);
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
