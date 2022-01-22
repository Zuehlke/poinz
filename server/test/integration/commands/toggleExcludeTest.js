import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('ownUser: toggleExclude  -> excluded', async () => {
  const {userIdOne, userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {
        userId: userIdOne
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'excludedFromEstimations');

  const [excludedFromEstimationsEvent] = producedEvents;

  expect(excludedFromEstimationsEvent.userId).toEqual(userIdOne);
  expect(excludedFromEstimationsEvent.payload.userId).toEqual(userIdOne);

  // flag is set in room object on user specified in payload
  expect(room.users[0].id).toBe(userIdOne);
  expect(room.users[0].excluded).toBe(true);

  // the other user is unchanged
  expect(room.users[1].excluded).toBeFalsy();
  expect(room.users[1].id).toBe(userIdTwo);
});

test('ownUser: toggleExclude  -> included', async () => {
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
      payload: {
        userId: userIdOne
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'includedInEstimations');

  const [includedInEstimationsEvent] = producedEvents;

  expect(includedInEstimationsEvent.userId).toEqual(userIdOne);
  expect(includedInEstimationsEvent.payload.userId).toEqual(userIdOne);

  // flag is set to false, on room object on user specified in payload
  expect(room.users[0].id).toBe(userIdOne);
  expect(room.users[0].excluded).toBe(false);

  // the other user is unchanged
  expect(room.users[1].excluded).toBeFalsy();
  expect(room.users[1].id).toBe(userIdTwo);
});

test('otherUser: toggleExclude  -> excluded (since #200)', async () => {
  const {userIdOne, userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {
        userId: userIdTwo // <<- userOne sets userTwo as excluded
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'excludedFromEstimations');

  const [excludedFromEstimationsEvent] = producedEvents;

  expect(excludedFromEstimationsEvent.userId).toEqual(userIdOne);
  expect(excludedFromEstimationsEvent.payload.userId).toEqual(userIdTwo); // <<- payload contains userId of toggledUser

  // flag is set in room object on user specified in payload
  expect(room.users[1].id).toBe(userIdTwo);
  expect(room.users[1].excluded).toBe(true);

  // the other user (userOne, that sent the command) is unchanged
  expect(room.users[0].id).toBe(userIdOne);
  expect(room.users[0].excluded).toBeFalsy();
});

test('otherUser: toggleExclude  -> included (since #200)', async () => {
  const {userIdOne, userIdTwo, processor, roomId, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[1].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'toggleExclude',
      payload: {
        userId: userIdTwo
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'includedInEstimations');

  const [includedInEstimationsEvent] = producedEvents;

  expect(includedInEstimationsEvent.userId).toEqual(userIdOne);
  expect(includedInEstimationsEvent.payload.userId).toEqual(userIdTwo);

  // flag is set to false, on room object on user specified in payload
  expect(room.users[1].id).toBe(userIdTwo);
  expect(room.users[1].excluded).toBe(false);

  // the other user is unchanged
  expect(room.users[0].excluded).toBeFalsy();
  expect(room.users[0].id).toBe(userIdOne);
});
