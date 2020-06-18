import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyDeleted event', async () => {
  const {userId, processor, roomId, storyId} = await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'deleteStory',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyDeleted');

    const [storyDeletedEvent] = producedEvents;

    expect(storyDeletedEvent.payload.storyId).toEqual(storyId);

    // story is removed from room
    expect(room.stories[storyId]).toBeUndefined();
  });
});

test('users marked as excluded can still delete stories', async () => {
  const {
    userId,
    processor,
    roomId,
    storyId,
    mockRoomsStore
  } = await prepOneUserInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'excluded'], true));

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'deleteStory',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents}) =>
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyDeleted')
  );
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'deleteStory',
          payload: {
            storyId: 'some-unknown-story'
          }
        },
        userId
      )
    ).rejects.toThrow('Cannot delete unknown story some-unknown-story');
  });
});
