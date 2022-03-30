import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('Two users in room, adding Stories, estimate stories', async () => {
  const outputFilename = 'estimatingTest.json';

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId, 'Jim'), 6);
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  // activate confidence levels on this room
  await client.cmdAndWait(
    client.cmds.setRoomConfig(roomId, firstUserId, {
      autoReveal: true /*default*/,
      withConfidence: true
    })
  );

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

  // first user clears again
  await client.cmdAndWait(client.cmds.clearEstimate(roomId, firstUserId, storyIdOne));

  // both estimate 5
  await client.cmdAndWait(client.cmds.giveEstimate(roomId, firstUserId, storyIdOne, 5));
  await client.cmdAndWait(
    client.cmds.giveEstimate(roomId, secondUserId, storyIdOne, 5, 1),
    3 // given, revealed, consensus
  );

  // start new round
  await client.cmdAndWait(client.cmds.newRound(roomId, secondUserId, storyIdOne));

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
