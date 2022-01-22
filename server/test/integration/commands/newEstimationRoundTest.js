import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../../unit/testUtils';

test('Should produce newEstimationRoundStarted event', async () => {
  const {processor, roomId, storyId, userIdOne, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

  mockRoomsStore.manipulate((room) => {
    room.stories[0].consensus = 4;
    return room;
  });

  const commandId = uuid();
  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'newEstimationRoundStarted');

  const [newRoundStartedEvent] = producedEvents;

  expect(newRoundStartedEvent.payload.storyId).toEqual(storyId);

  // Should clear estimations
  expect(Object.values(room.stories[0].estimations).length).toBe(0);

  // revealed flag is reset
  expect(room.stories[0].revealed).toBe(false);

  // previously achieved consensus is reset
  expect(room.stories[0].consensus).toBeUndefined();
});

test('Users marked as excluded can still start new estimation round', async () => {
  // this is wanted, since "excluded" users want to be "moderators" (i.e. Scrum Masters)
  // so, apart from estimating, they should be able to manipulate stories, etc.

  const {processor, roomId, storyId, userIdOne, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

  mockRoomsStore.manipulate((room) => {
    room.users[0].excluded = true;
    return room;
  });

  const commandId = uuid();
  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId,
      name: 'newEstimationRound',
      payload: {
        storyId
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'newEstimationRoundStarted');
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
