import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storyChanged event', async () => {
  const {processor, roomId, userId, storyId} = await prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storyChangedEvent = producedEvents[0];
    testUtils.assertValidEvent(storyChangedEvent, commandId, roomId, userId, 'storyChanged');
    expect(storyChangedEvent.payload.storyId).toEqual(storyId);
    expect(storyChangedEvent.payload.title).toEqual('NewTitle');
    expect(storyChangedEvent.payload.description).toEqual('New Description');
  });
});

test('Should store value', async () => {
  const {processor, roomId, userId, storyId, mockRoomsStore} = await prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userId
  )
    .then(() => mockRoomsStore.getRoomById(roomId))
    .then((room) => {
      expect(room.getIn(['stories', storyId, 'title'])).toEqual('NewTitle');
      expect(room.getIn(['stories', storyId, 'description'])).toEqual('New Description');
    });
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {processor, roomId, userId} = await prep();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'changeStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'NewTitle',
            description: 'New Description'
          }
        },
        userId
      )
    ).rejects.toThrow('Cannot change unknown story some-unknown-story');
  });

  test('Should throw if user is a visitor', async () => {
    const {processor, roomId, userId, mockRoomsStore, storyId} = await prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'changeStory',
          payload: {
            storyId,
            title: 'SuperStory 232',
            description: 'This will be awesome'
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot change stories!');
  });
});

/**
 * prepares mock rooms store with two users,   adds story
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

  return {userId, roomId, processor, storyId, mockRoomsStore};
}
