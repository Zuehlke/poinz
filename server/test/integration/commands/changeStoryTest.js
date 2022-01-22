import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce storyChanged event', async () => {
  const {processor, roomId, userIdOne, storyId} = await prepTwoUsersInOneRoomWithOneStory(
    'mySuperUser',
    'nice Story'
  );
  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyChanged');

  const [storyChangedEvent] = producedEvents;

  expect(storyChangedEvent.payload).toMatchObject({
    storyId,
    title: 'NewTitle',
    description: 'New Description'
  });

  expect(room.stories[0].title).toEqual('NewTitle');
  expect(room.stories[0].description).toEqual('New Description');
});

test('Users marked as excluded can still change stories', async () => {
  const {processor, roomId, userIdOne, storyId, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory('mySuperUser', 'nice Story');

  mockRoomsStore.manipulate((room) => {
    room.users[0].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'changeStory',
      payload: {
        storyId,
        title: 'NewTitle',
        description: 'New Description'
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'storyChanged');
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {processor, roomId, userIdOne} = await prepTwoUsersInOneRoomWithOneStory(
      'mySuperUser',
      'nice Story'
    );

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'changeStory',
          payload: {
            storyId: 'some-unknown-story',
            title: 'NewTitle',
            description: 'New Description'
          }
        },
        userIdOne
      )
    ).rejects.toThrow(
      /Precondition Error during "changeStory": Given story some-unknown-story does not belong to room .*/
    );
  });

  test('Should throw if story is trashed', async () => {
    const {processor, roomId, storyId, userIdOne, mockRoomsStore} =
      await prepTwoUsersInOneRoomWithOneStory('mySuperUser', 'nice Story');

    mockRoomsStore.manipulate((room) => {
      room.stories[0].trashed = true;
      return room;
    });

    return expect(
      processor(
        {
          id: uuid(),
          roomId,
          name: 'changeStory',
          payload: {
            storyId,
            title: 'NewTitle',
            description: 'New Description'
          }
        },
        userIdOne
      )
    ).rejects.toThrow(
      /Precondition Error during "changeStory": Given story .* is marked as "trashed" and cannot be selected or manipulated.*/
    );
  });

  test('Should fail, if story title is too long (more than 100 chars)', async () => {
    const {processor, roomId, storyId, userIdOne} = await prepTwoUsersInOneRoomWithOneStory(
      'mySuperUser',
      'nice Story'
    );

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'changeStory',
          payload: {
            storyId,
            title: 't'.repeat(101),
            description: 'kdjgk'
          }
        },
        userIdOne
      )
    ).rejects.toThrow('String is too long (101 chars), maximum 100 in /payload/title');
  });

  test('Should fail, if story description is too long (more than 2k chars)', async () => {
    const {processor, roomId, storyId, userIdOne} = await prepTwoUsersInOneRoomWithOneStory(
      'mySuperUser',
      'nice Story'
    );

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'changeStory',
          payload: {
            storyId,
            title: 'test',
            description: 't'.repeat(2001)
          }
        },
        userIdOne
      )
    ).rejects.toThrow('String is too long (2001 chars), maximum 2000 in /payload/description');
  });
});
