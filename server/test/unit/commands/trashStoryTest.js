import {v4 as uuid} from 'uuid';

import {EXPECT_UUID_MATCHING, prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyTrashed event', async () => {
  const {userId, processor, roomId, storyId, mockStore} = await prepOneUserInOneRoomWithOneStory();

  // add second story, set second story as selected
  const secondStoryId = uuid();
  mockStore.manipulate((room) => {
    room.stories[secondStoryId] = {
      id: secondStoryId,
      title: 'secondStory'
    };
    return room;
  });
  mockStore.manipulate((room) => {
    room.selectedStory = secondStoryId;
    return room;
  });

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

test('Should produce additional storySelected event if story to trash was the selected one', async () => {
  const {userId, processor, roomId, storyId, mockStore} = await prepOneUserInOneRoomWithOneStory();

  // add second story, set our first story as selected
  const secondStoryId = uuid();

  mockStore.manipulate((room) => {
    room.stories[secondStoryId] = {
      id: secondStoryId,
      title: 'secondStory'
    };
    room.selectedStory = storyId;
    return room;
  });

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
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyTrashed', 'storySelected');

    const [storyTrashedEvent, storySelectedEvent] = producedEvents;

    expect(storyTrashedEvent.payload.storyId).toEqual(storyId);

    expect(storySelectedEvent.payload.storyId).toEqual(secondStoryId);

    // story is still in room, marked as "trashed"
    expect(room.stories[storyId]).toMatchObject({
      id: EXPECT_UUID_MATCHING,
      estimations: {},
      title: 'the title',
      description: 'This will be awesome',
      trashed: true
    });
    expect(room.selectedStory).toEqual(secondStoryId);
  });
});

test('users marked as excluded can still trash stories', async () => {
  const {userId, processor, roomId, storyId, mockStore} = await prepOneUserInOneRoomWithOneStory();

  mockStore.manipulate((room) => {
    room.users[userId].excluded = true;
    return room;
  });

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
  ).then(({producedEvents}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyTrashed', 'storySelected');

    const [storyTrashedEvent, storySelectedEvent] = producedEvents;

    expect(storyTrashedEvent.payload.storyId).toEqual(storyId);

    expect(storySelectedEvent.payload.storyId).toEqual(undefined); // no more stories in room, so "undefined" is selected
  });
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
