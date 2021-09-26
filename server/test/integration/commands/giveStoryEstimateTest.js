import {v4 as uuid} from 'uuid';

import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce storyEstimateGiven event', async () => {
  const {roomId, storyId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId,
        value: 2
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven');

  const [storyEstimateGivenEvent] = producedEvents;

  expect(storyEstimateGivenEvent.userId).toEqual(userId);
  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].estimations).toEqual({
    [userId]: 2
  });

  expect(room.stories[0].estimationsConfidence).toBeUndefined();
});

test('Should produce storyEstimateGiven event with confidence property', async () => {
  const {roomId, storyId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId,
        value: 2,
        confidence: 1
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven');

  const [storyEstimateGivenEvent] = producedEvents;

  expect(storyEstimateGivenEvent.userId).toEqual(userId);
  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);
  expect(storyEstimateGivenEvent.payload.confidence).toBe(1); // confidence value on event payload

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].estimations).toEqual({
    [userId]: 2
  });

  // confidence stored separately on store object
  expect(room.stories[0].estimationsConfidence).toEqual({
    [userId]: 1
  });
});

test('Should produce "revealed" event if everybody (allowed) estimated ', async () => {
  const {roomId, storyId, userIdOne, userIdTwo, processor} =
    await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 4
      }
    },
    userIdOne // first user estimates story
  );

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdTwo // second user estimates story
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven', 'revealed');

  const [storyEstimateGivenEvent, revealedEvent] = producedEvents;

  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(revealedEvent.payload.storyId).toEqual(storyId);
  expect(revealedEvent.payload.manually).toBe(false);

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].revealed).toBe(true);
});

test('Should produce "revealed" event if first user estimated and lost connection ', async () => {
  const {roomId, storyId, userIdOne, userIdTwo, processor} =
    await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 4
      }
    },
    userIdOne // first user estimates story
  );

  const {producedEvents: leaveEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'leaveRoom',
      payload: {
        connectionLost: true
      }
    },
    userIdOne // first user looses connection
  );
  expect(leaveEvents).toMatchEvents(commandId, roomId, 'connectionLost');

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdTwo // second user estimates story
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven', 'revealed');

  const [storyEstimateGivenEvent, revealedEvent] = producedEvents;

  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(revealedEvent.payload.storyId).toEqual(storyId);
  expect(revealedEvent.payload.manually).toBe(false);

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].revealed).toBe(true);
});

test('Should produce "consensusAchieved" and "revealed" event if everybody (allowed) estimated the same value', async () => {
  const {roomId, storyId, userIdOne, userIdTwo, processor} =
    await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdOne // first user estimates "2"
  );

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdTwo // second user estimates "2"
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven',
    'revealed',
    'consensusAchieved'
  );

  const [storyEstimateGivenEvent, revealedEvent, consensusAchievedEvent] = producedEvents;

  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(revealedEvent.payload.storyId).toEqual(storyId);
  expect(revealedEvent.payload.manually).toBe(false);

  expect(consensusAchievedEvent.payload).toEqual({
    storyId: storyId,
    value: 2
  });

  expect(room.stories[0].consensus).toBe(2);
});

test('Should produce "consensusAchieved" and "revealed" event if manually revealed (autoReveal off)', async () => {
  const {roomId, storyId, userIdOne, userIdTwo, processor, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.autoReveal = false;
    return room;
  });

  const commandId = uuid();

  await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdOne // first user estimates "2"
  );

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdTwo // second user estimates "2"
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven');

  const [storyEstimateGivenEvent] = producedEvents;
  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(room.stories[0].consensus).toBeUndefined();
  expect(room.stories[0].revealed).toBeUndefined();

  const {producedEvents: producedEvents2, room: room2} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'reveal',
      payload: {
        storyId: storyId
      }
    },
    userIdTwo
  );

  expect(producedEvents2).toMatchEvents(commandId, roomId, 'revealed', 'consensusAchieved');

  const [revealedEvent, consensusAchievedEvent] = producedEvents2;

  expect(revealedEvent.payload.storyId).toEqual(storyId);
  expect(revealedEvent.payload.manually).toBe(true);

  expect(consensusAchievedEvent.payload).toEqual({
    storyId: storyId,
    value: 2
  });

  expect(room2.stories[0].consensus).toBe(2);
  expect(room2.stories[0].revealed).toBe(true);
});

test('Should not produce revealed event if user changes his estimation', async () => {
  const {roomId, storyId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  // our user estimates 2
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven');

  const [storyEstimateGivenEvent] = producedEvents;

  expect(storyEstimateGivenEvent.userId).toEqual(userId);
  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].estimations[userId]).toBe(2);

  // -- now our user changes his mind and estimates 5 (same story of course)
  const {producedEvents: scndProducedEvents, room: roomAfterScndCommand} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 5
      }
    },
    userId
  );

  expect(scndProducedEvents).toMatchEvents(commandId, roomId, 'storyEstimateGiven');

  const [scndStoryGivenEvent] = scndProducedEvents;

  expect(scndStoryGivenEvent.userId).toEqual(userId);
  expect(scndStoryGivenEvent.payload.storyId).toEqual(storyId);
  expect(scndStoryGivenEvent.payload.value).toBe(5);

  // estimated value is stored on story in room
  expect(roomAfterScndCommand.stories.length).toBe(1);
  expect(roomAfterScndCommand.stories[0].estimations[userId]).toBe(5);
});

test('Should produce additional "revealed" and "consensusAchieved" events if all users estimated (only one user)', async () => {
  const {
    roomId,
    storyId,
    userIdOne: userId,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users.splice(-1);
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven',
    'revealed',
    'consensusAchieved'
  );

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].estimations).toEqual({
    [userId]: 2
  });
});

test('Should produce additional "revealed" and "consensusAchieved" events if all users estimated (other user is excluded)', async () => {
  const {
    roomId,
    storyId,
    userIdOne: userId,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[1].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven',
    'revealed',
    'consensusAchieved'
  );
});

test('Should produce additional "revealed" and "consensusAchieved" events if all users estimated (other user is disconnected)', async () => {
  const {
    roomId,
    storyId,
    userIdOne: userId,
    processor,
    mockRoomsStore
  } = await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[1].disconnected = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven',
    'revealed',
    'consensusAchieved'
  );
});

describe('preconditions', () => {
  test('Should throw if storyId does not match "selectedStory"', async () => {
    const {
      roomId,
      userIdOne: userId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();

    const secondStoryId = uuid();

    mockRoomsStore.manipulate((room) => {
      room.stories[secondStoryId] = {
        id: secondStoryId,
        title: 'second story'
      };

      return room;
    });

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: secondStoryId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "giveStoryEstimate": Can only give estimation for currently selected story/
    );
  });

  test('Should throw if story already revealed', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();

    mockRoomsStore.manipulate((room) => {
      room.stories[0].revealed = true;
      return room;
    });

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('You cannot give an estimate for a story that was revealed!');
  });

  test('Should throw if user is marked as excluded', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();

    mockRoomsStore.manipulate((room) => {
      room.users[0].excluded = true;
      return room;
    });

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('Users that are excluded from estimations cannot give estimations!');
  });
});
