import {v4 as uuid} from 'uuid';
import {assertEvents, prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../testUtils';

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
    const [newRoundStartedEvent] = assertEvents(
      producedEvents,
      commandId,
      roomId,
      'newEstimationRoundStarted'
    );

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
});
