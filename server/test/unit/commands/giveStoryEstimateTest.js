import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storyEstimateGiven event', async () => {
  const {roomId, storyId, userId, processor} = await prep();
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
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storyEstimatgeGivenEvent = producedEvents[0];
    testUtils.assertValidEvent(
      storyEstimatgeGivenEvent,
      commandId,
      roomId,
      userId,
      'storyEstimateGiven'
    );
    expect(storyEstimatgeGivenEvent.payload.userId).toEqual(userId);
    expect(storyEstimatgeGivenEvent.payload.storyId).toEqual(storyId);
    expect(storyEstimatgeGivenEvent.payload.value).toBe(2);
  });
});

test('Should not produce revealed event if user changes his estimation', async () => {
  const {roomId, storyId, userId, processor} = await prep();
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
    .then((producedEvents) => {
      expect(producedEvents).toBeDefined();
      expect(producedEvents.length).toBe(1);

      const storyEstimatgeGivenEvent = producedEvents[0];
      testUtils.assertValidEvent(
        storyEstimatgeGivenEvent,
        commandId,
        roomId,
        userId,
        'storyEstimateGiven'
      );
      expect(storyEstimatgeGivenEvent.payload.userId).toEqual(userId);
      expect(storyEstimatgeGivenEvent.payload.storyId).toEqual(storyId);
      expect(storyEstimatgeGivenEvent.payload.value).toBe(2);
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
    .then((producedEvents) => {
      expect(producedEvents).toBeDefined();
      expect(producedEvents.length).toBe(1);

      const storyEstimateGivenEvent = producedEvents[0];
      testUtils.assertValidEvent(
        storyEstimateGivenEvent,
        commandId,
        roomId,
        userId,
        'storyEstimateGiven'
      );
      expect(storyEstimateGivenEvent.payload.userId).toEqual(userId);
      expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
      expect(storyEstimateGivenEvent.payload.value).toBe(5);
    });
});

test('Should store value', async () => {
  const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
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
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['stories', storyId, 'estimations', userId])).toBe(2));
});

describe('with additional "revealed" event', () => {
  test('Should produce additional "revealed" event if all users estimated (only one user)', async () => {
    const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.removeIn(['users', 'someoneElse']));
    return handleCommandAndAssertRevealed(processor, roomId, storyId, userId);
  });

  test('Should produce additional "revealed" event if all users estimated (other user is visitor)', async () => {
    const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', 'someoneElse', 'visitor'], true));
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
    ).then((producedEvents) => {
      expect(producedEvents).toBeDefined();
      expect(producedEvents.length).toBe(2);

      const storyEstimatgeGivenEvent = producedEvents[0];
      testUtils.assertValidEvent(
        storyEstimatgeGivenEvent,
        commandId,
        roomId,
        userId,
        'storyEstimateGiven'
      );

      const revealedEvent = producedEvents[1];
      testUtils.assertValidEvent(revealedEvent, commandId, roomId, userId, 'revealed');
      expect(revealedEvent.payload.manually).toBe(false);
      expect(revealedEvent.payload.storyId).toEqual(storyId);
    });
  }
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {roomId, storyId, userId, processor} = await prep();

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
    const {roomId, userId, processor} = await prep();
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
    const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();

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
    const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
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

/**
 * prepares mock rooms store with two users, adds story and selects it
 */
async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    users: {
      [userId]: {
        id: userId
      },
      someoneElse: {
        id: 'someoneElse',
        username: 'John Doe'
      }
    }
  });
  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  const storyId = await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 444',
        description: 'This will be awesome'
      }
    },
    userId
  ).then((producedEvents) => producedEvents[0].payload.id);

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'selectStory',
      payload: {
        storyId: storyId
      }
    },
    userId
  );

  return {userId, roomId, processor, storyId, mockRoomsStore};
}
