import {v4 as uuid} from 'uuid';
import testUtils from '../testUtils';
import processorFactory from '../../../src/commandProcessor';

// we want to test with real command- and event handlers!
import commandHandlers from '../../../src/commandHandlers/commandHandlers';
import eventHandlers from '../../../src/eventHandlers/eventHandlers';

test('Should produce storyAdded event', async () => {
  const {userId, roomId, processor} = prep();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(1);

    const storyAddedEvent = producedEvents[0];
    testUtils.assertValidEvent(storyAddedEvent, commandId, roomId, userId, 'storyAdded');
    expect(storyAddedEvent.payload.title).toEqual('SuperStory 232');
    expect(storyAddedEvent.payload.description).toEqual('This will be awesome');
    expect(storyAddedEvent.payload.estimations).toEqual({});
  });
});

test('Should produce storyAdded and additional storySelected event if this is the first story', async () => {
  const {userId, roomId, processor, mockRoomsStore} = prep();
  const commandId = uuid();
  mockRoomsStore.manipulate((room) => room.removeIn(['stories', 'abc']));

  return processor(
    {
      id: commandId,
      roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    },
    userId
  ).then((producedEvents) => {
    expect(producedEvents).toBeDefined();
    expect(producedEvents.length).toBe(2);

    const storyAddedEvent = producedEvents[0];
    testUtils.assertValidEvent(storyAddedEvent, commandId, roomId, userId, 'storyAdded');
    expect(storyAddedEvent.payload.title).toEqual('SuperStory 232');
    expect(storyAddedEvent.payload.description).toEqual('This will be awesome');
    expect(storyAddedEvent.payload.estimations).toEqual({});

    const storySelectedEvent = producedEvents[1];
    testUtils.assertValidEvent(storySelectedEvent, commandId, roomId, userId, 'storySelected');
  });
});

test('Should store new story in room', async () => {
  const {userId, roomId, processor, mockRoomsStore} = prep();
  return processor(
    {
      id: uuid(),
      roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    },
    userId
  ).then((producedEvents) =>
    mockRoomsStore
      .getRoomById(roomId)
      .then((room) => expect(room.getIn(['stories', producedEvents[0].payload.id])).toBeDefined())
  );
});

describe('preconditions', () => {
  test('Should throw if user is a visitor', async () => {
    const {userId, roomId, processor, mockRoomsStore} = prep();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'addStory',
          payload: {
            title: 'SuperStory 232',
            description: 'This will be awesome'
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot add stories!');
  });
});

/**
 * create mock room store with one user and one story
 */
function prep() {
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
    stories: {
      abc: {
        id: 'abc',
        title: 'some',
        estimations: {}
      }
    }
  });
  const processor = processorFactory(commandHandlers, eventHandlers, mockRoomsStore);

  return {userId, roomId, processor, mockRoomsStore};
}
