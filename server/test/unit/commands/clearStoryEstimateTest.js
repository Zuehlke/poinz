import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../testUtils';

test('Should produce storyEstimateCleared event', async () => {
  const {
    roomId,
    storyId,
    userIdOne: userId,
    processor
  } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'clearStoryEstimate',
      payload: {
        storyId: storyId,
        userId: userId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'storyEstimateCleared');

    const [storyEstimateClearedEvent] = producedEvents;

    expect(storyEstimateClearedEvent.payload.userId).toEqual(userId);
    expect(storyEstimateClearedEvent.payload.storyId).toEqual(storyId);

    // should clear value
    expect(room.stories[storyId].estimations[userId]).toBeUndefined();
  });
});

describe('preconditions', () => {
  test('Should throw if userId does not match', async () => {
    const {
      roomId,
      storyId,
      userIdOne: userId,
      processor
    } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: 'unknown'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only clear estimate if userId in command payload matches!');
  });

  test('Should throw if storyId does not match', async () => {
    const {
      roomId,
      userIdOne: userId,
      processor
    } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: 'unknown',
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('Can only clear estimation for currently selected story!');
  });

  test('Should throw if story already revealed', async () => {
    const {
      roomId,
      userIdOne: userId,
      storyId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    mockRoomsStore.manipulate((room) => room.setIn(['stories', storyId, 'revealed'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('You cannot clear your estimate for a story that was revealed!');
  });

  test('Should throw if user is marked as excluded', async () => {
    const {
      roomId,
      userIdOne: userId,
      storyId,
      processor,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'excluded'], true));

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'clearStoryEstimate',
          payload: {
            storyId: storyId,
            userId: userId
          }
        },
        userId
      )
    ).rejects.toThrow('Users marked as excluded cannot clear estimations!');
  });
});
