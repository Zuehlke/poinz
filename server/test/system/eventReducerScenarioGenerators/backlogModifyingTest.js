import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('backlogModifyingTest: Adding Stories, editing them, trash/restore and delete them', async () => {
  const outputFilename = 'backlogModifyingTest.json';

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  const roomCreationEvents = await client.cmdAndWait(
    client.cmds.joinRoom(roomId, firstUserId, 'Jim'),
    6
  );
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  const storyAddedZero = roomCreationEvents[4]; // on room creation, there is a default story added;

  // both users add one story each
  const [storyAddedOne] = await client.cmdAndWait(
    client.cmds.addStory(roomId, firstUserId, 'ISSUE-SUPER-1', 'This is a story'),
    1 // just storyAdded, the room contains the sample story already
  );

  const [storyAddedTwo] = await client.cmdAndWait(
    client.cmds.addStory(roomId, secondUserId, 'ISSUE-SUPER-2', 'This is a second story')
  );

  // now edit them
  await client.cmdAndWait(
    client.cmds.changeStory(
      roomId,
      firstUserId,
      storyAddedOne.payload.storyId,
      'ISSUE-SUPER-1-changed',
      'This is a story changed'
    )
  );

  await client.cmdAndWait(
    client.cmds.changeStory(
      roomId,
      firstUserId,
      storyAddedTwo.payload.storyId,
      'ISSUE-SUPER-2-changed',
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

  // manually order stories

  const [storyAddedThree] = await client.cmdAndWait(
    client.cmds.addStory(roomId, secondUserId, 'ISSUE-SUPER-3', 'This is a third story')
  );

  const [storyAddedFour] = await client.cmdAndWait(
    client.cmds.addStory(roomId, secondUserId, 'ISSUE-SUPER-4', 'This is a fourth story')
  );

  await client.cmdAndWait(
    client.cmds.setSortOrder(roomId, firstUserId, [
      storyAddedTwo.payload.storyId,
      storyAddedFour.payload.storyId,
      storyAddedZero.payload.storyId,
      storyAddedThree.payload.storyId
    ])
  );

  await client.cmdAndWait(
    client.cmds.setSortOrder(roomId, firstUserId, [
      storyAddedThree.payload.storyId,
      storyAddedZero.payload.storyId,
      storyAddedTwo.payload.storyId,
      storyAddedFour.payload.storyId
    ])
  );

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
