import {v4 as uuid} from 'uuid';

import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce autoRevealOff & autoRevealOn events', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'toggleAutoReveal',
      payload: {}
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'autoRevealOff');
  expect(room.autoReveal).toBe(false);

  const commandId2 = uuid();
  const {producedEvents: producedEvents2, room: room2} = await processor(
    {
      id: commandId2,
      roomId: roomId,
      name: 'toggleAutoReveal',
      payload: {}
    },
    userId
  );

  expect(producedEvents2).toMatchEvents(commandId2, roomId, 'autoRevealOn');
  expect(room2.autoReveal).toBe(true);
});

test('Should not produce "revealed" event if autoReveal is off', async () => {
  const {roomId, storyId, userIdOne, userIdTwo, processor, mockRoomsStore} =
    await prepTwoUsersInOneRoomWithOneStory();

  mockRoomsStore.manipulate((room) => {
    room.autoReveal = false;
    return room;
  });

  const commandId = uuid();

  await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 4
      }
    },
    userIdOne // first user estimates story
  );

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'giveStoryEstimate',
      payload: {
        storyId: storyId,
        value: 2
      }
    },
    userIdTwo // second user estimates story
  );

  expect(producedEvents).toMatchEvents(
    commandId,
    roomId,
    'storyEstimateGiven' /* no revealed event here  */
  );

  const [storyEstimateGivenEvent] = producedEvents;

  expect(storyEstimateGivenEvent.payload.storyId).toEqual(storyId);
  expect(storyEstimateGivenEvent.payload.value).toBe(2);

  expect(room.stories.length).toBe(1);
  expect(room.stories[0].revealed).toBeUndefined(); // story is not revealed
});
