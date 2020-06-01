import {v4 as uuid} from 'uuid';
import {assertEvents, prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyEstimateGiven event', async () => {
  const {roomId, storyId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        userId: userId,
        value: 2
      }
    },
    userId
  ).then(({producedEvents}) => {
    const [storyEstimateGivenEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'storyEstimateGiven'
    );

    expect(storyEstimateGivenEvent.payload.userId).toEqual(userId);
    expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
    expect(storyEstimateGivenEvent.payload.value).toBe(2);
  });
});

test('Should not produce revealed event if user changes his estimation', async () => {
  const {roomId, storyId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        userId: userId,
        value: 2
      }
    },
    userId
  )
    .then(({producedEvents, room}) => {
      const [storyEstimateGivenEvent] = assertEvents(
        producedEvents,
        commandId,
        roomId,
        'storyEstimateGiven'
      );

      expect(storyEstimateGivenEvent.payload.userId).toEqual(userId);
      expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
      expect(storyEstimateGivenEvent.payload.value).toBe(2);

      // estimated value is stored on story in room
      expect(room.stories[storyId].estimations[userId]).toBe(2);
    })
    .then(() =>
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId,
            value: 5
          }
        },
        userId
      )
    )
    .then(({producedEvents, room}) => {
      const [storyEstimateGivenEvent] = assertEvents(
        producedEvents,
        commandId,
        roomId,
        'storyEstimateGiven'
      );

      expect(storyEstimateGivenEvent.payload.userId).toEqual(userId);
      expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
      expect(storyEstimateGivenEvent.payload.value).toBe(5);

      // estimated value is stored on story in room
      expect(room.stories[storyId].estimations[userId]).toBe(5);
    });
});

describe('with additional "revealed" event', () => {
  test('Should produce additional "revealed" event if all users estimated (only one user)', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      userIdTwo,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.removeIn(['users', userIdTwo]));
    return handleCommandAndAssertRevealed(processor, roomId, storyId, userId);
  });

  test('Should produce additional "revealed" event if all users estimated (other user is visitor)', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      userIdTwo,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userIdTwo, 'visitor'], true));
    return handleCommandAndAssertRevealed(processor, roomId, storyId, userId);
  });

  function handleCommandAndAssertRevealed(processor, roomId, storyId, userId) {
    const commandId = uuid();
    return processor(
      {
        id: commandId,
        roomId: roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId: storyId,
          userId: userId,
          value: 2
        }
      },
      userId
    ).then(({producedEvents}) => {
      const [storyEstimatgeGivenEvent, revealedEvent] = assertEvents(
        producedEvents,
        commandId,
        roomId,
        'storyEstimateGiven',
        'revealed'
      );

      expect(storyEstimatgeGivenEvent).toBeDefined();

      expect(revealedEvent.payload.manually).toBe(false);
      expect(revealedEvent.payload.storyId).toEqual(storyId);
    });
  }
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor
    } = await prepTwoUsersInOneRoomWithOneStory();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            userId: 'unknown',
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('Can only give estimate if userId in command payload matches');
  });

  test('Should throw if storyId does not match', async () => {
    const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: 'unknown',
            userId: userId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('Can only give estimation for currently selected story!');
  });

  test('Should throw if story already revealed', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.setIn(['stories', storyId, 'revealed'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('You cannot give an estimate for a story that was revealed!');
  });

  test('Should throw if user is a visitor', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId,
            value: 2
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot give estimations!');
  });
});
