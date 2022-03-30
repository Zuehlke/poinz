import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStoryAndEstimate} from '../../unit/testUtils';

test('Should produce consensusAchieved event', async () => {
  const {roomId, storyId, userIdTwo, processor} =
    await prepTwoUsersInOneRoomWithOneStoryAndEstimate(); // first user already estimated

  const commandId = uuid();

  const {producedEvents: secondUserEstimatesEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId,
        value: 5
      }
    },
    userIdTwo
  );

  // both users have now estimated. story is automatically revealed. different values. no consensus so far.
  expect(secondUserEstimatesEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven',
    'revealed'
  );

  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'settleEstimation',
      payload: {
        storyId,
        value: 5
      }
    },
    userIdTwo
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'consensusAchieved');

  const [consensusAchievedEvent] = producedEvents;

  expect(consensusAchievedEvent.payload).toEqual({
    storyId,
    value: 5,
    settled: true
  });
});

test('Should also allow value (to settle) that was not estimated by anyone (as of #207)', async () => {
  const {roomId, userIdOne, userIdTwo, processor, storyId} =
    await prepTwoUsersInOneRoomWithOneStoryAndEstimate('jimmy', 'some story', 1);

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId,
        value: 5
      }
    },
    userIdTwo
  );

  const commandId = uuid();

  const {producedEvents} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'settleEstimation',
      payload: {
        storyId,
        value: 8 // <<- this value was not estimated by anyone in the room
      }
    },
    userIdOne
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'consensusAchieved');

  const [consensusAchievedEvent] = producedEvents;

  expect(consensusAchievedEvent.payload).toEqual({
    storyId,
    value: 8,
    settled: true
  });
});

test('Should allow to settle on all stories with consensus (not only the selected story)', async () => {
  const {roomId, userIdOne, userIdTwo, processor, storyId} =
    await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

  const userTwoGiveEstmCommandId = uuid();
  const {producedEvents: userTwoEstimatedEvents} = await processor(
    {
      id: userTwoGiveEstmCommandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId,
        value: 5
      }
    },
    userIdTwo
  );

  // the mockRoom already contains estimation of first user -> thus on second user estimation, story is revealed (no consensus, different estm values)
  expect(userTwoEstimatedEvents).toMatchEvents(
    userTwoGiveEstmCommandId,
    roomId,
    'storyEstimateGiven',
    'revealed'
  );

  // second story is added and selected
  const {producedEvents: addStoryEvents} = await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'addStory',
      payload: {
        title: 'second story'
      }
    },
    userIdTwo
  );

  await processor(
    {
      id: uuid(),
      roomId: roomId,
      name: 'selectStory',
      payload: {
        storyId: addStoryEvents[0].payload.storyId
      }
    },
    userIdTwo
  );

  const settleCommandId = uuid();
  const {producedEvents: settleEvents} = await processor(
    {
      id: settleCommandId,
      roomId: roomId,
      name: 'settleEstimation',
      payload: {
        storyId, // the storyId of the first story
        value: 5
      }
    },
    userIdOne
  );

  expect(settleEvents).toMatchEvents(settleCommandId, roomId, 'consensusAchieved');
});

describe('preconditions', () => {
  test('Should throw if storyId does not match a story in the room', async () => {
    const {roomId, userIdOne, userIdTwo, processor, storyId} =
      await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    await processor(
      {
        id: uuid(),
        roomId: roomId,
        name: 'giveStoryEstimate',
        payload: {
          storyId,
          value: 5
        }
      },
      userIdTwo
    );

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'settleEstimation',
          payload: {
            storyId: 'unknown',
            value: 5
          }
        },
        userIdOne
      )
    ).rejects.toThrow('Given story unknown does not belong to room ');
  });

  test('Should throw if story is not revealed', async () => {
    const {roomId, userIdOne, processor, storyId} =
      await prepTwoUsersInOneRoomWithOneStoryAndEstimate();

    return expect(
      processor(
        {
          id: uuid(),
          roomId: roomId,
          name: 'settleEstimation',
          payload: {
            storyId,
            value: 5
          }
        },
        userIdOne
      )
    ).rejects.toThrow('You cannot settle estimation for a story that was NOT YET revealed!');
  });
});
