import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyDeleted event', async () => {
  const {userId, processor, roomId, storyId, mockStore} = await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  mockStore.manipulate((room) => {
    room.stories[storyId].trashed = true;
    return room;
  });

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
  const {userId, processor, roomId, storyId, mockStore} = await prepOneUserInOneRoomWithOneStory();

  mockStore.manipulate((room) => {
    room.users[userId].excluded = true;
    room.stories[storyId].trashed = true;
    return room;
  });

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

test('Should throw if storyId is not uuid v4 format', async () => {
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
  ).rejects.toThrow(/Format validation failed \(must be a valid uuid v4\) in \/payload\/storyId/);
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
