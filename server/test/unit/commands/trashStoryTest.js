import {v4 as uuid} from 'uuid';
import {EXPECT_UUID_MATCHING, prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyTrashed event', async () => {
  const {userId, processor, roomId, storyId} = await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'trashStory',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyTrashed');

    const [storyTrashedEvent] = producedEvents;

    expect(storyTrashedEvent.payload.storyId).toEqual(storyId);

    // story is still in room, marked as "trashed"
    expect(room.stories[storyId]).toMatchObject({
      id: EXPECT_UUID_MATCHING,
      estimations: {},
      title: 'the title',
      description: 'This will be awesome',
      trashed: true
    });
  });
});

test('users marked as excluded can still trash stories', async () => {
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
      name: 'trashStory',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents}) =>
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyTrashed')
  );
});

test('Should throw if storyId is not uuid v4 format', async () => {
  const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();
  return expect(
    processor(
      {
        id: uuid(),
        roomId,
        name: 'trashStory',
        payload: {
          storyId: 'some-unknown-story'
        }
      },
      userId
    )
  ).rejects.toThrow(/Format validation failed \(must be a valid uuid v4\) in \/payload\/storyId/);
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'trashStory',
          payload: {
            storyId: uuid()
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "trashStory": Given story .* does not belong to room .*/
    );
  });
});
