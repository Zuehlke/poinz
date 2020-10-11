import {v4 as uuid} from 'uuid';
import {EXPECT_UUID_MATCHING, prepOneUserInOneRoom} from '../testUtils';

test('Should produce storyAdded and storySelected event (since it is the first story added to the room)', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

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
  ).then(({producedEvents}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyAdded', 'storySelected');

    const [storyAddedEvent, storySelectedEvent] = producedEvents;

    expect(storyAddedEvent.payload).toMatchObject({
      title: 'SuperStory 232',
      description: 'This will be awesome',
      estimations: {}
    });
    expect(storySelectedEvent.payload).toMatchObject({
      storyId: EXPECT_UUID_MATCHING
    });
  });
});

test('Should produce storyAdded event', async () => {
  const {userId, roomId, processor} = await prepOneUserInOneRoom();

  const commandId = uuid();

  // adding two stories
  return processor(
    {
      id: commandId,
      roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 111'
      }
    },
    userId
  )
    .then(() =>
      processor(
        {
          id: commandId,
          roomId,
          name: 'addStory',
          payload: {
            title: 'SuperStory 222',
            description: 'This will be awesome'
          }
        },
        userId
      )
    )
    .then(({producedEvents, room}) => {
      expect(producedEvents).toMatchEvents(commandId, roomId, 'storyAdded');

      const [storyAddedEvent] = producedEvents;

      expect(storyAddedEvent.payload).toMatchObject({
        title: 'SuperStory 222',
        description: 'This will be awesome',
        estimations: {}
      });

      expect(room.stories[producedEvents[0].payload.id]).toBeDefined();
      expect(Object.values(room.stories).length).toBe(2);
    });
});

test('users excluded from estimations can still add stories', async () => {
  const {userId, roomId, processor, mockStore} = await prepOneUserInOneRoom();

  mockStore.manipulate((room) => {
    room.users[userId].excluded = true;
    return room;
  });

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
  ).then(({producedEvents}) =>
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyAdded', 'storySelected')
  );
});

describe('preconditions', () => {
  test('Should fail, if story title is too short (empty)', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
    const commandId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'addStory',
          payload: {
            title: ''
          }
        },
        userId
      )
    ).rejects.toThrow('String is too short (0 chars), minimum 1 in /payload/title');
  });

  test('Should fail, if story title is too long (more than 100 chars)', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
    const commandId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'addStory',
          payload: {
            title: 't'.repeat(101)
          }
        },
        userId
      )
    ).rejects.toThrow('String is too long (101 chars), maximum 100 in /payload/title');
  });

  test('Should fail, if story description is too long (more than 2k chars)', async () => {
    const {processor, roomId, userId} = await prepOneUserInOneRoom();
    const commandId = uuid();

    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'addStory',
          payload: {
            title: 'test',
            description: 't'.repeat(2001)
          }
        },
        userId
      )
    ).rejects.toThrow('String is too long (2001 chars), maximum 2000 in /payload/description');
  });
});
