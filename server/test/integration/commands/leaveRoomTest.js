import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce leftRoom event', async () => {
  const {userIdTwo, processor, roomId, userIdOne} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {}
    },
    userIdTwo
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'leftRoom');

  const [leftRoomEvent] = producedEvents;

  expect(leftRoomEvent.userId).toEqual(userIdTwo);

  expect(room.users.length).toBe(1);
  expect(room.users[0].id).toBe(userIdOne);
});

test('Should keep estimations on stories after user left', async () => {
  const {userIdTwo, processor, roomId, storyId, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const estimatedValue = 3;
  mockRoomsStore.manipulate((room) => {
    room.stories[0].estimations[userIdTwo] = estimatedValue;
    return room;
  });

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {}
    },
    userIdTwo
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'leftRoom');

  const [leftRoomEvent] = producedEvents;

  expect(leftRoomEvent.userId).toEqual(userIdTwo);

  expect(room.users[userIdTwo]).toBeUndefined();
  expect(Object.values(room.users).length).toBe(1);

  // but estimation on story is preserved
  expect(room.stories[0].id).toBe(storyId);
  expect(room.stories[0].estimations[userIdTwo]).toBe(estimatedValue);
});

test('Should produce connectionLost event', async () => {
  const {userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {
        connectionLost: true
      }
    },
    userIdTwo
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'connectionLost');

  const [connectionLostEvent] = producedEvents;

  expect(connectionLostEvent.userId).toEqual(userIdTwo);

  expect(room.users.length).toBe(2);
  expect(room.users[1]).toBeDefined();
  expect(room.users[1]).toMatchObject({
    disconnected: true,
    id: userIdTwo,
    username: 'secondUser'
  });
});
