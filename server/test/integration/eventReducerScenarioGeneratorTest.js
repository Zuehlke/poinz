import {v4 as uuid} from 'uuid';
import path from 'path';

import poinzSocketClientFactory from './poinzSocketClient';

const clientEventActionReducerScenarioDir = path.resolve(
  __dirname,
  '../../../client/test/unit/eventActionReducersScenarios'
);

/**
 *  Creates real-live lists of events by firing commands to the backend. (not really a test, no assertions here)
 *  these "scenarios" are used for frontend reducer unit tests.
 *  We ensure that the frontend reducer tests use valid backend events!
 *
 *  This needs a running Poinz backend on localhost:3000
 */

test('backlogModifyingTest: Adding Stories, editing them, trash/restore and delete them', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'backlogModifyingTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  const cmdId = client.commands.joinRoom(roomId, firstUserId);
  await client.waitForEvents(cmdId, 3);

  const cmdId2 = client.commands.joinRoom(roomId, secondUserId);
  await client.waitForEvents(cmdId2, 2);

  const cmdId3 = client.commands.setUsername(roomId, firstUserId, 'Jim');
  await client.waitForEvents(cmdId3, 1);

  const cmdId4 = client.commands.setUsername(roomId, secondUserId, 'John');
  await client.waitForEvents(cmdId4, 1);

  // both users add one story each
  const cmdId5 = client.commands.addStory(roomId, firstUserId, 'ISSUE-SUPER-2', 'This is a story');
  const [storyAddedOne] = await client.waitForEvents(cmdId5, 2); // storyAdded and storySelected

  const cmdId6 = client.commands.addStory(
    roomId,
    secondUserId,
    'ISSUE-SUPER-5',
    'This is a second story'
  );
  const [storyAddedTwo] = await client.waitForEvents(cmdId6, 1);

  const cmdId7 = client.commands.selectStory(roomId, secondUserId, storyAddedTwo.payload.storyId);
  await client.waitForEvents(cmdId7, 1);

  // now edit them
  const cmdId8 = client.commands.changeStory(
    roomId,
    firstUserId,
    storyAddedOne.payload.storyId,
    'ISSUE-SUPER-22',
    'This is a story changed'
  );
  await client.waitForEvents(cmdId8, 1);

  const cmdId9 = client.commands.changeStory(
    roomId,
    firstUserId,
    storyAddedTwo.payload.storyId,
    'ISSUE-SUPER-55',
    'This is a second story changed'
  );
  await client.waitForEvents(cmdId9, 1);

  const cmdId10 = client.commands.trashStory(roomId, firstUserId, storyAddedTwo.payload.storyId);
  await client.waitForEvents(cmdId10, 2); // trashed and selected (the still active story)

  const cmdId11 = client.commands.restoreStory(roomId, firstUserId, storyAddedTwo.payload.storyId);
  await client.waitForEvents(cmdId11, 1);

  const cmdId12 = client.commands.trashStory(roomId, firstUserId, storyAddedOne.payload.storyId);
  await client.waitForEvents(cmdId12, 1);

  const cmdId13 = client.commands.deleteStory(roomId, firstUserId, storyAddedOne.payload.storyId);
  await client.waitForEvents(cmdId13, 1);

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('estimatingTest: Adding Stories, estimate them', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'estimatingTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  const cmdId = client.commands.joinRoom(roomId, firstUserId);
  await client.waitForEvents(cmdId, 3);

  const cmdId2 = client.commands.joinRoom(roomId, secondUserId);
  await client.waitForEvents(cmdId2, 2);

  const cmdId3 = client.commands.setUsername(roomId, firstUserId, 'Jim');
  await client.waitForEvents(cmdId3, 1);

  const cmdId4 = client.commands.setUsername(roomId, secondUserId, 'John');
  await client.waitForEvents(cmdId4, 1);

  // first user adds two stories
  const cmdId5 = client.commands.addStory(roomId, firstUserId, 'ISSUE-SUPER-2', 'This is a story');
  const [storyAddedOne] = await client.waitForEvents(cmdId5, 2); // storyAdded and storySelected
  const storyIdOne = storyAddedOne.payload.storyId;

  const cmdId6 = client.commands.addStory(
    roomId,
    firstUserId,
    'ISSUE-SUPER-5',
    'This is a second story'
  );
  await client.waitForEvents(cmdId6, 1);

  // first user estimates first story
  const cmdId7 = client.commands.giveEstimate(roomId, firstUserId, storyIdOne, 3);
  await client.waitForEvents(cmdId7, 1);

  // first user clears again
  const cmdId8 = client.commands.clearEstimate(roomId, firstUserId, storyIdOne);
  await client.waitForEvents(cmdId8, 1);

  // both estimate 5
  const cmdId9 = client.commands.giveEstimate(roomId, firstUserId, storyIdOne, 5);
  await client.waitForEvents(cmdId9, 1);
  const cmdId10 = client.commands.giveEstimate(roomId, secondUserId, storyIdOne, 5);
  await client.waitForEvents(cmdId10, 3); // given, revealed, consensus

  // start new round
  const cmdId11 = client.commands.newRound(roomId, secondUserId, storyIdOne);
  await client.waitForEvents(cmdId11, 1);

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('disconnectAndKickTest: two users, one disconnects, kick him', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'disconnectAndKickTest.json');

  // we need two clients, since on "connectionLost" , server removes socket of "leaving" user from room
  const clientA = poinzSocketClientFactory();
  const clientB = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  const cmdId = clientA.commands.joinRoom(roomId, firstUserId);
  await clientA.waitForEvents(cmdId, 3);
  const cmdId3 = clientA.commands.setUsername(roomId, firstUserId, 'Jim');
  await clientA.waitForEvents(cmdId3, 1);

  const cmdId2 = clientB.commands.joinRoom(roomId, secondUserId);
  await clientB.waitForEvents(cmdId2, 2);
  const cmdId4 = clientB.commands.setUsername(roomId, secondUserId, 'John');
  await clientB.waitForEvents(cmdId4, 1);

  // second user adds a story and estimates it
  const cmdId7 = clientB.commands.addStory(roomId, secondUserId, 'ISSUE-SUPER-2');
  const [storyAdded] = await clientB.waitForEvents(cmdId7, 2); // added and selected
  const cmdId8 = clientB.commands.giveEstimate(roomId, secondUserId, storyAdded.payload.storyId, 8);
  await clientB.waitForEvents(cmdId8, 1);

  // second user looses connection ("leaves" with "connectionLost"=true)
  const cmdId5 = clientB.commands.leaveRoom(roomId, secondUserId, true);
  await clientB.waitForEvents(cmdId5, 1); // connectionLost

  // kick second user
  const cmdId6 = clientA.commands.kick(roomId, firstUserId, secondUserId);
  await clientA.waitForEvents(cmdId6, 1); // kicked

  // in the end, write to file and close socket
  await clientA.dumpAllEvents(outputFile);
  clientA.disconnect();
});
