import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storyEstimateCleared event', async () => {
  const {roomId, storyId, userId, processor} = await prep();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: storyId,
        userId: userId
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storyEstimateClearedEvent = producedEvents[0];
    testUtils.assertValidEvent(
      storyEstimateClearedEvent,
      commandId,
      roomId,
      userId,
      'storyEstimateCleared'
    );
    expect(storyEstimateClearedEvent.payload.userId).toEqual(userId);
    expect(storyEstimateClearedEvent.payload.storyId).toEqual(storyId);
  });
});

test('Should clear value', async () => {
  const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: storyId,
        userId: userId
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) =>
      expect(room.getIn(['stories', storyId, 'estimations', userId])).toBeUndefined()
    );
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {roomId, storyId, userId, processor} = await prep();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: 'unknown'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only clear estimate if userId in command payload matches!');
  });

  test('Should throw if storyId does not match', async () => {
    const {roomId, userId, processor} = await prep();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: 'unknown',
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('Can only clear estimation for currently selected story!');
  });

  test('Should throw if story already revealed', async () => {
    const {roomId, userId, storyId, processor, mockRoomsStore} = await prep();

    mockRoomsStore.manipulate((room) => room.setIn(['stories', storyId, 'revealed'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('You cannot clear your estimate for a story that was revealed!');
  });

  test('Should throw if user is a visitor', async () => {
    const {roomId, userId, storyId, processor, mockRoomsStore} = await prep();

    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot clear estimations!');
  });
});

/**
 * prepares mock rooms store,  adds story, selects it and gives estimate
 */
async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    users: {
      [userId]: {
        id: userId,
        username: 'Tester'
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

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        userId: userId,
        storyId: storyId,
        value: 8
      }
    },
    userId
  );

  return {userId, roomId, processor, storyId, mockRoomsStore};
}
