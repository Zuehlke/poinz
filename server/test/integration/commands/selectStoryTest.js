import uuid from '../../../src/uuid';
import {prepOneUserInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce storySelected event', async () => {
  const {roomId, userId, storyId, processor} = await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'selectStory',
      payload: {
        storyId
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storySelected');

  const [storySelectedEvent] = producedEvents;

  expect(storySelectedEvent.payload.storyId).toEqual(storyId);

  // id set in room
  expect(room.selectedStory).toEqual(storyId);
});

test('Users marked as excluded can still select current story', async () => {
  const {roomId, userId, storyId, processor, mockRoomsStore} =
    await prepOneUserInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.users[0].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'selectStory',
      payload: {
        storyId
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storySelected');
});

describe('preconditions', () => {
  test('Should throw if story is not in room', async () => {
    const {roomId, userId, processor} = await prepOneUserInOneRoomWithOneStory();
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
      /Precondition Error during "selectStory": Given story story-not-in-room does not belong to room .*/
    );
  });

  test('Should throw if story is marked as "trashed"', async () => {
    const {roomId, userId, storyId, processor, mockRoomsStore} =
      await prepOneUserInOneRoomWithOneStory();

    mockRoomsStore.manipulate((room) => {
      room.stories[0].trashed = true;
      return room;
    });

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'selectStory',
          payload: {
            storyId
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "selectStory": Given story .* is marked as "trashed" and cannot be selected or manipulated/
    );
  });
});
