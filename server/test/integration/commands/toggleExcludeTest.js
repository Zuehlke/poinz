import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('toggleExclude  -> excluded', async () => {
  const {userIdOne, userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {}
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'excludedFromEstimations');

  const [excludedFromEstimationsEvent] = producedEvents;

  expect(excludedFromEstimationsEvent.userId).toEqual(userIdOne);

  // flag is set in room object on user that sent command
  expect(room.users[0].excluded).toBe(true);
  expect(room.users[0].id).toBe(userIdOne);

  // the other user is unchanged
  expect(room.users[1].excluded).toBeFalsy();
  expect(room.users[1].id).toBe(userIdTwo);
});

test('toggleExclude  -> included', async () => {
  const {userIdOne, userIdTwo, processor, roomId, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[0].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {}
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'includedInEstimations');

  const [includedInEstimationsEvent] = producedEvents;

  expect(includedInEstimationsEvent.userId).toEqual(userIdOne);

  // flag is set to false, on room object on user that sent command
  expect(room.users[0].excluded).toBe(false);
  expect(room.users[0].id).toBe(userIdOne);

  // the other user is unchanged
  expect(room.users[1].excluded).toBeFalsy();
  expect(room.users[1].id).toBe(userIdTwo);
});

test('cannot exclude another user (only myself)', async () => {
  const {userIdOne, userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();

  return expect(
    processor(
      {
        id: uuid(),
        roomId,
        name: 'toggleExclude',
        payload: {
          userId: userIdTwo
        }
      },
      userIdOne
    )
  ).rejects.toThrow(/Additional properties not allowed in \/payload\/userId/);
});
