import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../testUtils';

test('Should produce newEstimationRoundStarted event', async () => {
  const {processor, roomId, storyId, userId} = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();
  const commandId = uuid();
  return processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userId
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'newEstimationRoundStarted');

    const [newRoundStartedEvent] = producedEvents;

    expect(newRoundStartedEvent.payload.storyId).toEqual(storyId);

    // Should clear estimations
    expect(Object.values(room.stories[storyId].estimations).length).toBe(0);

    // revealed flag is reset
    expect(room.stories[storyId].revealed).toBe(false);
  });
});

describe('preconditions', () => {
  test('Should throw if storyId does not match currently selected story', async () => {
    const {processor, roomId, userId} = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();
    const commandId = uuid();
    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'newEstimationRound',
          payload: {
            storyId: 'anotherStory'
          }
        },
        userId
      )
    ).rejects.toThrow('Can only start a new round for currently selected story!');
  });

  test('Should throw if user is visitor', async () => {
    const {
      processor,
      roomId,
      storyId,
      userId,
      mockRoomsStore
    } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();
    mockRoomsStore.manipulate((room) => room.setIn(['users', userId, 'visitor'], true));

    const commandId = uuid();
    return expect(
      processor(
        {
          id: commandId,
          roomId: roomId,
          name: 'newEstimationRound',
          payload: {
            storyId
          }
        },
        userId
      )
    ).rejects.toThrow(
      'Precondition Error during "newEstimationRound": Visitors cannot start new estimation round!'
    );
  });
});
