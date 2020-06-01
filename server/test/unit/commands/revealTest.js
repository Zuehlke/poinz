import {v4 as uuid} from 'uuid';
import {prepOneUserInOneRoomWithOneStory} from '../testUtils';

test('Should produce revealed event', async () => {
  const {roomId, userId, storyId, processor} = await prepOneUserInOneRoomWithOneStory();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'reveal',
      payload: {
        storyId: storyId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'revealed');

    const [revealedEvent] = producedEvents;

    expect(revealedEvent.payload.storyId).toEqual(storyId);
    expect(revealedEvent.payload.manually).toBe(true);

    // flag set on story in room
    expect(room.stories[storyId].revealed).toBe(true);
  });
});

describe('preconditions', () => {
  test('Should throw if storyId does not match currently selected story', async () => {
    const {roomId, userId, processor} = await prepOneUserInOneRoomWithOneStory();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'reveal',
          payload: {
            storyId: 'anotherStory'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only reveal currently selected story!');
  });

  test('Should throw if user is visitor', async () => {
    const {
      roomId,
      storyId,
      userId,
      processor,
      mockRoomsStore
    } = await prepOneUserInOneRoomWithOneStory();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'reveal',
          payload: {
            storyId: storyId
          }
        },
        userId
      )
    ).rejects.toThrow('Visitors cannot reveal stories!');
  });
});
