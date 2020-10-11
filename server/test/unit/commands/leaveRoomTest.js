import {v4 as uuid} from 'uuid';

import {EXPECT_UUID_MATCHING, prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce leftRoom event', async () => {
  const {userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {}
    },
    userIdTwo
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'leftRoom');

    const [leftRoomEvent] = producedEvents;

    expect(leftRoomEvent.userId).toEqual(userIdTwo);

    expect(room.users[userIdTwo]).toBeUndefined();
    expect(Object.values(room.users).length).toBe(1);
  });
});

test('Should keep estimations on stories after user left', async () => {
  const {
    userIdTwo,
    processor,
    roomId,
    storyId,
    mockStore
  } = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const estimatedValue = 3;
  mockStore.manipulate((room) => {
    room.stories[storyId].estimations[userIdTwo] = estimatedValue;
    return room;
  });

  return processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {}
    },
    userIdTwo
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'leftRoom');

    const [leftRoomEvent] = producedEvents;

    expect(leftRoomEvent.userId).toEqual(userIdTwo);

    expect(room.users[userIdTwo]).toBeUndefined();
    expect(Object.values(room.users).length).toBe(1);

    // but estimation on story is preserved
    expect(room.stories[storyId].estimations[userIdTwo]).toBe(estimatedValue);
  });
});

test('Should produce connectionLost event', async () => {
  const {userIdTwo, processor, roomId} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'leaveRoom',
      payload: {
        connectionLost: true
      }
    },
    userIdTwo
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'connectionLost');

    const [connectionLostEvent] = producedEvents;

    expect(connectionLostEvent.userId).toEqual(userIdTwo);

    expect(room.users[userIdTwo]).toBeDefined();
    expect(room.users[userIdTwo]).toMatchObject({
      disconnected: true,
      id: EXPECT_UUID_MATCHING,
      username: 'secondUser'
    });
    expect(Object.values(room.users).length).toBe(2);
  });
});
