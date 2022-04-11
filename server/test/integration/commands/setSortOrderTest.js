import uuid from '../../../src/uuid';
import {prepOneUserInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce sortOrderSet event', async () => {
  const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoomWithOneStory();

  await addAdditionalStories(processor, roomId, userId, 4);
  const room = await mockRoomsStore.getRoomById(roomId);
  const storyIds = room.stories.map((s) => s.id);

  // let's set a manual order
  const manualOrderedStoryIds = [storyIds[0], storyIds[4], storyIds[1], storyIds[3], storyIds[2]];

  const commandId = uuid();
  const {producedEvents, room: roomAfter} = await processor(
    {
      id: commandId,
      roomId,
      name: 'setSortOrder',
      payload: {
        sortOrder: manualOrderedStoryIds
      }
    },
    userId
  );
  expect(producedEvents).toMatchEvents(commandId, roomId, 'sortOrderSet');

  const [sortOrderSetEvent] = producedEvents;

  expect(sortOrderSetEvent.payload.sortOrder).toEqual(manualOrderedStoryIds);

  // stories in room have "sortOrder" property set
  expect(roomAfter.stories.map((s) => ({id: s.id, sortOrder: s.sortOrder}))).toEqual([
    {
      id: manualOrderedStoryIds[0],
      sortOrder: 0
    },

    {
      id: manualOrderedStoryIds[1],
      sortOrder: 1
    },

    {
      id: manualOrderedStoryIds[2],
      sortOrder: 2
    },

    {
      id: manualOrderedStoryIds[3],
      sortOrder: 3
    },

    {
      id: manualOrderedStoryIds[4],
      sortOrder: 4
    }
  ]);
});

describe('preconditions', () => {
  test('Should throw if less storyIds in command than in room', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();

    await addAdditionalStories(processor, roomId, userId, 4);

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'setSortOrder',
          payload: {
            sortOrder: ['some', 'other', 'ids']
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "setSortOrder": Given sortOrder contains 3 storyIds. However, we have 5 stories in our room!/
    );
  });

  test('Should throw if storyIds in command do not match ids in room', async () => {
    const {userId, processor, roomId} = await prepOneUserInOneRoomWithOneStory();

    await addAdditionalStories(processor, roomId, userId, 4);

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'setSortOrder',
          payload: {
            sortOrder: ['some', 'other', 'ids', 'alltogether', 'j']
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "setSortOrder": Given sortOrder contains storyIds that do not match stories in our room!/
    );
  });

  test('Should throw if storyIds in command do not match ids in room (id twice)', async () => {
    const {userId, processor, roomId, mockRoomsStore} = await prepOneUserInOneRoomWithOneStory();

    await addAdditionalStories(processor, roomId, userId, 4);

    const room = await mockRoomsStore.getRoomById(roomId);
    const storyIds = room.stories.map((s) => s.id);

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'setSortOrder',
          payload: {
            sortOrder: [storyIds[4], storyIds[3], storyIds[2], storyIds[1], storyIds[1]] // <-  storyIds[1] twice - storyIds[0] missing
          }
        },
        userId
      )
    ).rejects.toThrow(
      /Precondition Error during "setSortOrder": Given sortOrder contains 4 storyIds. However, we have 5 stories in our room!/
    );
  });
});

async function addAdditionalStories(processor, roomId, userId, n) {
  // add additional stories
  for (let s = 0; s < n; s++) {
    await processor(
      {
        id: uuid(),
        roomId,
        name: 'addStory',
        payload: {
          title: 'Test-Story ' + s
        }
      },
      userId
    );
  }
}
