import {v4 as uuid} from 'uuid';
import {prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../testUtils';

test('Should produce newEstimationRoundStarted event', async () => {
  const {
    processor,
    roomId,
    storyId,
    userIdOne,
    mockStore
  } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();
  mockStore.manipulate((room) => {
    room.stories[storyId].consensus = 4;
    return room;
  });

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
    userIdOne
  ).then(({producedEvents, room}) => {
    expect(producedEvents).toMatchEvents(commandId, roomId, 'newEstimationRoundStarted');

    const [newRoundStartedEvent] = producedEvents;

    expect(newRoundStartedEvent.payload.storyId).toEqual(storyId);

    // Should clear estimations
    expect(Object.values(room.stories[storyId].estimations).length).toBe(0);

    // revealed flag is reset
    expect(room.stories[storyId].revealed).toBe(false);

    // previously achieved consensus is reset
    expect(room.stories[storyId].consensus).toBeUndefined();
  });
});

test('Users marked as excluded can still start new estimation round', async () => {
  // this is wanted, since "excluded" users want to be "moderators" (i.e. Scrum Masters)
  // so, apart from estimating, they should be able to manipulate stories, etc.

  const {
    processor,
    roomId,
    storyId,
    userIdOne,
    mockStore
  } = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

  mockStore.manipulate((room) => {
    room.users[userIdOne].excluded = true;
    return room;
  });

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
    userIdOne
  ).then(({producedEvents}) =>
    expect(producedEvents).toMatchEvents(commandId, roomId, 'newEstimationRoundStarted')
  );
});

describe('preconditions', () => {
  test('Should throw if storyId does not match currently selected story', async () => {
    const {processor, roomId, userIdOne} = await prepTwoUsersInOneRoomWithOneStoryAndEstimate();
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
        userIdOne
      )
    ).rejects.toThrow('Can only start a new round for currently selected story!');
  });
});
