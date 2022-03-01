import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('backlogModifyingTest: Adding Stories, editing them, trash/restore and delete them', async () => {
  const outputFilename = 'backlogModifyingTest.json';

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId, 'Jim'), 6);
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  // both users add one story each
  const [storyAddedOne] = await client.cmdAndWait(
    client.cmds.addStory(roomId, firstUserId, 'ISSUE-SUPER-2', 'This is a story'),
    1 // just storyAdded, the room contains the sample story already
  );

  const [storyAddedTwo] = await client.cmdAndWait(
    client.cmds.addStory(roomId, secondUserId, 'ISSUE-SUPER-5', 'This is a second story')
  );

  // now edit them
  await client.cmdAndWait(
    client.cmds.changeStory(
      roomId,
      firstUserId,
      storyAddedOne.payload.storyId,
      'ISSUE-SUPER-22',
      'This is a story changed'
    )
  );

  await client.cmdAndWait(
    client.cmds.changeStory(
      roomId,
      firstUserId,
      storyAddedTwo.payload.storyId,
      'ISSUE-SUPER-55',
      'This is a second story changed'
    )
  );

  await client.cmdAndWait(
    client.cmds.trashStory(roomId, firstUserId, storyAddedTwo.payload.storyId),
    1 // trashed
  );

  await client.cmdAndWait(
    client.cmds.restoreStory(roomId, firstUserId, storyAddedTwo.payload.storyId)
  );

  await client.cmdAndWait(
    client.cmds.trashStory(roomId, firstUserId, storyAddedOne.payload.storyId)
  );

  await client.cmdAndWait(
    client.cmds.deleteStory(roomId, firstUserId, storyAddedOne.payload.storyId)
  );

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
