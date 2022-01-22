import uuid from '../../../src/uuid';
import {prepOneUserInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce storyDeleted event', async () => {
  const {userId, processor, roomId, storyId, mockRoomsStore} =
    await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  mockRoomsStore.manipulate((room) => {
    room.stories[0].trashed = true;
    return room;
  });

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'deleteStory',
      payload: {
        storyId
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyDeleted');

  const [storyDeletedEvent] = producedEvents;

  expect(storyDeletedEvent.payload.storyId).toEqual(storyId);

  // story is removed from room
  expect(room.stories[storyId]).toBeUndefined();
});

test('users marked as excluded can still delete stories', async () => {
  const {userId, processor, roomId, storyId, mockRoomsStore} =
    await prepOneUserInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[0].excluded = true;
    room.stories[0].trashed = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'deleteStory',
      payload: {
        storyId
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyDeleted');
});

test('Should throw if storyId is not uuid format', async () => {
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
  ).rejects.toThrow(
    /Format validation failed \(must be a valid nanoid or uuid v4\) in \/payload\/storyId/
  );
});

describe('preconditions', () => {
  test('Should throw if story is not marked as "trashed"', async () => {
    const {userId, processor, roomId, storyId} = await prepOneUserInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'deleteStory',
          payload: {
            storyId
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "deleteStory": Given story .* in room .* is not marked as "trashed". cannot delete it!/
    );
  });

  test('Should throw if room does not contain matching story', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();
    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'deleteStory',
          payload: {
            storyId: uuid()
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "deleteStory": Given story .* does not belong to room .*/
    );
  });
});
