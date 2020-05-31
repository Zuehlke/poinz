import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storySelected event', async () => {
  const {roomId, userId, storyId, processor} = await prep();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'selectStory',
      payload: {
        storyId
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storySelectedEvent = producedEvents[0];
    testUtils.assertValidEvent(storySelectedEvent, commandId, roomId, userId, 'storySelected');
    expect(storySelectedEvent.payload.storyId).toEqual(storyId);
  });
});

test('Should store id of selectedStory', async () => {
  const {roomId, userId, storyId, processor, mockRoomsStore} = await prep();
  return processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'selectStory',
      payload: {
        storyId
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => expect(room.get('selectedStory')).toEqual(storyId));
});

describe('preconditions', () => {
  test('Should throw if story is not in room', async () => {
    const {roomId, userId, processor} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'selectStory',
          payload: {
            storyId: 'story-not-in-room'
          }
        },
        userId
      )
    ).rejects.toThrow(
      'Precondition Error during "selectStory": Story story-not-in-room cannot be selected. It is not part of room'
    );
  });

  test('Should throw if visitor tries to select current story', async () => {
    const {roomId, userId, storyId, processor, mockRoomsStore} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'selectStory',
          payload: {
            storyId: storyId
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot select current story!');
  });
});

/**
 * creates mock rooms store with one user and one story
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
      }
    },
    stories: {}
  });

  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  // prepare the state with a story
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

  return {userId, roomId, processor, mockRoomsStore, storyId};
}
