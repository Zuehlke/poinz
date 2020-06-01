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
        storyId,
        title: 'SuperStory 444'
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyDeleted');

    const [storyDeletedEvent] = producedEvents;

    expect(storyDeletedEvent.payload.storyId).toEqual(storyId);
    expect(storyDeletedEvent.payload.title).toEqual('SuperStory 444');

    // story is removed from room
    expect(room.stories[storyId]).toBeUndefined();
  });
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
            storyId: 'some-unknown-story',
            title: 'SuperStory 444'
          }
        },
        userId
      )
    ).rejects.toThrow('Cannot delete unknown story some-unknown-story');
  });

  test('Should throw if user is a visitor', async () => {
    const {
      userId,
      processor,
      roomId,
      mockRoomsStore,
      storyId
    } = await prepOneUserInOneRoomWithOneStory();
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
