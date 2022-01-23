import uuid from '../../../src/uuid';
import {prepTwoUsersInOneRoomWithOneStory} from '../../unit/testUtils';

test('Should produce roomConfigSet event with all properties set', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setRoomConfig',
      payload: {
        autoReveal: true,
        withConfidence: true,
        issueTrackingUrl: 'https://www.some.url.com/issues/{ISSUE}'
      }
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'roomConfigSet');

  expect(room.autoReveal).toBe(true);
  expect(room.withConfidence).toBe(true);
  expect(room.issueTrackingUrl).toBe('https://www.some.url.com/issues/{ISSUE}');
});

test('Should produce roomConfigSet event with no properties set (default values in room)', async () => {
  const {roomId, userIdOne: userId, processor} = await prepTwoUsersInOneRoomWithOneStory();
  const commandId = uuid();

  const {producedEvents, room} = await processor(
    {
      id: commandId,
      roomId: roomId,
      name: 'setRoomConfig',
      payload: {}
    },
    userId
  );

  expect(producedEvents).toMatchEvents(commandId, roomId, 'roomConfigSet');

  expect(room.autoReveal).toBe(false);
  expect(room.withConfidence).toBe(false);
  expect(room.issueTrackingUrl).toBeUndefined();
});

test('Should not produce "revealed" on estimation if autoReveal is off', async () => {
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
