import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce newEstimationRoundStarted event', async () => {
  const {processor, roomId, storyId, userId} = await prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const newRoundStartedEvent = producedEvents[0];
    testUtils.assertValidEvent(
      newRoundStartedEvent,
      commandId,
      roomId,
      userId,
      'newEstimationRoundStarted'
    );
    expect(newRoundStartedEvent.payload.storyId).toEqual(storyId);
  });
});

test('Should clear estimations', async () => {
  const {processor, roomId, userId, storyId, mockRoomsStore} = await prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['stories', storyId, 'estimations']).size).toBe(0));
});

test('Should clear "revealed" flag', async () => {
  const {processor, roomId, userId, storyId, mockRoomsStore} = await prep();
  const commandId = uuid();
  mockRoomsStore.manipulate((room) => room.setIn(['stories', storyId, 'revealed'], true));

  return processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['stories', storyId, 'revealed'])).toBe(false));
});

describe('preconditions', () => {
  test('Should throw if storyId does not match currently selected story', async () => {
    const {processor, roomId, userId} = await prep();
    const commandId = uuid();
    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'newEstimationRound',
          payload: {
            storyId: 'anotherStory'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only start a new round for currently selected story!');
  });
});

/**
 * prepares mock rooms store with two users,  adds story, selects it and gives estimate
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
