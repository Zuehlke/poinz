import poinzSocketClientFactory from './poinzSocketClient.js';
import uuid from '../../src/uuid.js';
import {faker} from '@faker-js/faker';
import {httpGetJSON} from './systemTestUtils.js';
import {textToJsonDataUrl} from '../testUtils.js';

test('exportStoriesToJsonAndReImport', async () => {
  const client = poinzSocketClientFactory();
  const roomId = 'system-test-' + uuid();
  const userId = uuid();

  // create + join room, add story, select story, give estimate
  const eventsOnJoin = await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, faker.person.firstName()),
    6
  );
  const firstDefaultStoryAddedEvent = eventsOnJoin[eventsOnJoin.length - 2];
  const [storyAdded] = await client.cmdAndWait(
    client.cmds.addStory(roomId, userId, 'story-1', 'This is a manually added story'),
    1
  );
  const storyId = storyAdded.payload.storyId;
  await client.cmdAndWait(client.cmds.selectStory(roomId, userId, storyId), 1);
  await client.cmdAndWait(client.cmds.giveEstimate(roomId, userId, storyId, 13), 3); // storyEstimateGiven  + revealed + consensusAchieved

  // export stories
  const {statusCode: statusCodeExport, body: bodyExport} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/export/room/' + roomId,
    method: 'GET',
    headers: {
      'X-USER': userId
    }
  });

  expect(statusCodeExport).toBe(200);
  expect(bodyExport).toMatchObject({
    roomId
  });
  expect(bodyExport.stories.length).toBe(2);

  const storiesExportString = JSON.stringify(bodyExport);
  const dataUrl = textToJsonDataUrl(storiesExportString);

  await client.cmdAndWait(
    client.cmds.trashStory(roomId, userId, firstDefaultStoryAddedEvent.payload.storyId),
    1
  );
  await client.cmdAndWait(
    client.cmds.deleteStory(roomId, userId, firstDefaultStoryAddedEvent.payload.storyId),
    1
  );
  await client.cmdAndWait(client.cmds.trashStory(roomId, userId, storyId), 1);
  await client.cmdAndWait(client.cmds.deleteStory(roomId, userId, storyId), 1);

  await client.cmdAndWait(client.cmds.importStories(roomId, userId, dataUrl), 4);

  const {statusCode: statusCodeRoomState, body: bodyRoomState} = await httpGetJSON({
    host: 'localhost',
    port: 3000,
    path: '/api/room/' + roomId,
    method: 'GET',
    headers: {
      'X-USER': userId
    }
  });
  expect(statusCodeRoomState).toBe(200);
  expect(bodyRoomState.stories.length).toBe(2);

  expect(bodyRoomState.stories[1].consensus).toBe(13);

  client.disconnect();
});
