import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storyDeleted event', async () => {
  const {userId, processor, roomId, storyId} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'deleteStory',
      payload: {
        storyId,
        title: 'SuperStory 444'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storyDeletedEvent = producedEvents[0];
    testUtils.assertValidEvent(storyDeletedEvent, commandId, roomId, userId, 'storyDeleted');
    expect(storyDeletedEvent.payload.storyId).toEqual(storyId);
    expect(storyDeletedEvent.payload.title).toEqual('SuperStory 444');
  });
});

test('Should delete story', async () => {
  const {userId, processor, roomId, storyId, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId,
      name: 'deleteStory',
      payload: {
        storyId,
        title: 'SuperStory 444'
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.getIn(['stories', storyId])).toBeUndefined());
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {userId, processor, roomId} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'deleteStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'SuperStory 444'
          }
        },
        userId
      )
    ).rejects.toThrow('Cannot delete unknown story some-unknown-story');
  });

  test('Should throw if user is a visitor', async () => {
    const {userId, processor, roomId, mockRoomsStore, storyId} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'deleteStory',
          payload: {
            storyId,
            title: 'SuperStory 444'
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot delete stories!');
  });
});

async function prep() {
  const userId = uuid();
  const roomId = 'rm_' + uuid();

  const mockRoomsStore = testUtils.newMockRoomsStore({
    id: roomId,
    users: {
      [userId]: {
        id: userId,
        username: 'Tester'
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

  return {userId, roomId, processor, storyId, mockRoomsStore};
}
