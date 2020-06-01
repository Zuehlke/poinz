import {v4 as uuid} from 'uuid';
import { prepTwoUsersInOneRoomWithOneStory} from '../testUtils';

test('Should produce storyChanged event', async () => {
  const {processor, roomId, userId, storyId} = await prepTwoUsersInOneRoomWithOneStory(
    'mySuperUser',
    'nice Story'
  );
  const commandId = uuid();
  return processor(
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
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyChanged');

    const [storyChangedEvent] = producedEvents;

    expect(storyChangedEvent.payload).toMatchObject({
      storyId,
      title: 'NewTitle',
      description: 'New Description'
    });

    expect(room.stories[storyId].title).toEqual('NewTitle');
    expect(room.stories[storyId].description).toEqual('New Description');
  });
});

describe('preconditions', () => {
  test('Should throw if room does not contain matching story', async () => {
    const {processor, roomId, userId} = await prepTwoUsersInOneRoomWithOneStory(
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
        userId
      )
    ).rejects.toThrow('Cannot change unknown story some-unknown-story');
  });

  test('Should throw if user is a visitor', async () => {
    const {
      processor,
      roomId,
      userId,
      storyId,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStory('mySuperUser', 'nice Story');
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'changeStory',
          payload: {
            storyId,
            title: 'SuperStory 232',
            description: 'This will be awesome'
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot change stories!');
  });
});
