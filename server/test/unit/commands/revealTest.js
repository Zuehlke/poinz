import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce revealed event', async () => {
  const {roomId, userId, storyId, processor} = await prep();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'reveal',
      payload: {
        storyId: storyId
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const revealedEvent = producedEvents[0];
    testUtils.assertValidEvent(revealedEvent, commandId, roomId, userId, 'revealed');
    expect(revealedEvent.payload.storyId).toEqual(storyId);
    expect(revealedEvent.payload.manually).toBe(true);
  });
});

test('Should set "revealed" flag', async () => {
  const {roomId, userId, storyId, processor, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'reveal',
      payload: {
        storyId: storyId
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['stories', storyId, 'revealed'])).toBe(true));
});

describe('preconditions', () => {
  test('Should throw if storyId does not match currently selected story', async () => {
    const {roomId, userId, processor} = await prep();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'reveal',
          payload: {
            storyId: 'anotherStory'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only reveal currently selected story!');
  });

  test('Should throw if user is visitor', async () => {
    const {roomId, storyId, userId, processor, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'reveal',
          payload: {
            storyId: storyId
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot reveal stories!');
  });
});

/**
 * prepares mock rooms store, adds story and selects it
 */
async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    users: {
      [userId]: {
        id: userId
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
