import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce storySelected event', async () => {
  const {roomId, userId, storyId, processor} = await prepOneUserInOneRoomWithOneStory();
  const commandId = uuid();

  return processor(
    {
      id: commandId,
      roomId,
      name: 'selectStory',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storySelected');

    const [storySelectedEvent] = producedEvents;

    expect(storySelectedEvent.payload.storyId).toEqual(storyId);

    // id set in room
    expect(room.selectedStory).toEqual(storyId);
  });
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
      'Precondition Error during "selectStory": Story story-not-in-room cannot be selected. It is not part of room'
    );
  });

  test('Should throw if visitor tries to select current story', async () => {
    const {
      roomId,
      userId,
      storyId,
      processor,
      mockRoomsStore
    } = await prepOneUserInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'selectStory',
          payload: {
            storyId: storyId
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot select current story!');
  });
});
