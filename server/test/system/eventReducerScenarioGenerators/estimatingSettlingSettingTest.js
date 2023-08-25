import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('Two users in room, adding Stories, estimate stories, manually settle, then manually set value (matrix)', async () => {
  const outputFilename = 'estimatingSettlingSettingTest.json';

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId, 'Jim'), 6);
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  // first user adds two stories
  const [storyAddedOne] = await client.cmdAndWait(
    client.cmds.addStory(roomId, firstUserId, 'ISSUE-SUPER-2', 'This is a story'),
    1 // just storyAdded, room contains sample story already
  );
  const storyIdOne = storyAddedOne.payload.storyId;

  await client.cmdAndWait(
    client.cmds.addStory(roomId, firstUserId, 'ISSUE-SUPER-5', 'This is a second story')
  );

  await client.cmdAndWait(client.cmds.selectStory(roomId, secondUserId, storyIdOne));

  // first user estimates first story
  await client.cmdAndWait(client.cmds.giveEstimate(roomId, firstUserId, storyIdOne, 3));

  // second user estimates first story
  await client.cmdAndWait(
    client.cmds.giveEstimate(roomId, secondUserId, storyIdOne, 8),
    2 // given, revealed   -  no consensus
  );

  // first user settles
  await client.cmdAndWait(
    client.cmds.settleEstimation(roomId, firstUserId, storyIdOne, 5),
    1 // consensus achieved
  );

  // second user manually sets value (in real use, this is done via the story matrix, dragging story to a new column)
  await client.cmdAndWait(
    client.cmds.setStoryValue(roomId, firstUserId, storyIdOne, 13),
    1 // storyValueSet
  );

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
