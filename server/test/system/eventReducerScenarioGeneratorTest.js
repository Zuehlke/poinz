import {v4 as uuid} from 'uuid';
import path from 'path';

import poinzSocketClientFactory from './poinzSocketClient';

const clientEventActionReducerScenarioDir = path.resolve(
  __dirname,
  '../../../client/test/integration/eventActionReducersScenarios/events'
);

/**
 *  Creates real-live lists of events by firing commands to the backend. (not really a test, no assertions here)
 *  these "scenarios" are used for frontend reducer unit tests.
 *  We ensure that the frontend reducer tests use valid backend events!
 *
 *  This needs a running Poinz backend on localhost:3000
 *
 *  This writes json files to the client directory!
 *
 *  See client/test/integration/eventActionReducersScenarios/README.md
 */

test('backlogModifyingTest: Adding Stories, editing them, trash/restore and delete them', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'backlogModifyingTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId), 5);

  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId), 2);

  await client.cmdAndWait(client.cmds.setUsername(roomId, firstUserId, 'Jim'));

  await client.cmdAndWait(client.cmds.setUsername(roomId, secondUserId, 'John'));

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
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('estimatingTest: Adding Stories, estimate them', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'estimatingTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId), 5);

  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId), 2);

  await client.cmdAndWait(client.cmds.setUsername(roomId, firstUserId, 'Jim'));

  await client.cmdAndWait(client.cmds.setUsername(roomId, secondUserId, 'John'));

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

  const eventsFromJoin = await clientA.cmdAndWait(clientA.cmds.joinRoom(roomId, firstUserId), 5);
  await clientA.cmdAndWait(clientA.cmds.setUsername(roomId, firstUserId, 'Jim'));

  await clientB.cmdAndWait(clientB.cmds.joinRoom(roomId, secondUserId), 2);
  await clientB.cmdAndWait(clientB.cmds.setUsername(roomId, secondUserId, 'John'));

  // second user estimates default (sample) story

  const storyAdded = eventsFromJoin[3];
  await clientB.cmdAndWait(
    clientB.cmds.giveEstimate(roomId, secondUserId, storyAdded.payload.storyId, 8)
  );

  // second user looses connection ("leaves" with "connectionLost"=true)
  await clientB.cmdAndWait(
    clientB.cmds.leaveRoom(roomId, secondUserId, true),
    1 // connectionLost
  );

  // kick second user
  await clientA.cmdAndWait(
    clientA.cmds.kick(roomId, firstUserId, secondUserId),
    1 // kicked
  );

  // in the end, write to file and close socket
  await clientA.dumpAllEvents(outputFile);
  clientA.disconnect();
  clientB.disconnect();
});

test('joinAndLeave ', async () => {
  const outputFile = path.join(
    clientEventActionReducerScenarioDir,
    'roomJoiningAndLeavingTest.json'
  );

  // we need two clients, since on "connectionLost" and "leftRoom", server removes socket of "leaving" user from room
  const clientA = poinzSocketClientFactory();
  const clientB = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  // first user joins, adds story, estimates it alone
  const firstJoinEvents = await clientA.cmdAndWait(clientA.cmds.joinRoom(roomId, firstUserId), 5);
  await clientA.cmdAndWait(clientA.cmds.setUsername(roomId, firstUserId, 'Jim'));

  await clientA.cmdAndWait(
    clientA.cmds.giveEstimate(roomId, firstUserId, firstJoinEvents[3].payload.storyId, 4, 1),
    3 // given, revealed, consensus
  );

  // second user joins room with already a estimated story in it
  await clientB.cmdAndWait(clientB.cmds.joinRoom(roomId, secondUserId), 2);
  await clientB.cmdAndWait(clientB.cmds.setUsername(roomId, secondUserId, 'John'));
  await clientB.cmdAndWait(clientB.cmds.setEmail(roomId, secondUserId, 'test.johnny@gmail.com'));

  const cmdId = clientA.cmds.leaveRoom(roomId, firstUserId);
  await clientB.waitForEvents(cmdId, 1); // leftRoom

  // in the end, write to file and close socket
  await clientA.dumpAllEvents(outputFile);
  clientA.disconnect();
  clientB.disconnect();
});

test('joinAndLeaveWithPassword ', async () => {
  const outputFile = path.join(
    clientEventActionReducerScenarioDir,
    'roomJoiningAndLeavingWithPasswordTest.json'
  );

  const roomId = uuid();

  const client = poinzSocketClientFactory();
  const userId = uuid();

  //  user joins, creates room on the fly with password "1234"
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com', '1234'),
    3
  );

  //  user re-joins, with correct password
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com', '1234'),
    3
  );

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('resetAndClearPassword ', async () => {
  const outputFile = path.join(
    clientEventActionReducerScenarioDir,
    'resetAndClearPasswordTest.json'
  );

  const roomId = uuid();

  const client = poinzSocketClientFactory();
  const userId = uuid();

  //  user joins, creates room on the fly without password
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com'),
    3
  );

  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, 'new-password'));

  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, ''));

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('includeAndExcludeTest: two users, one excludes and includes himself. Then second user excludes&includes first user', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'includeAndExcludeTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();
  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId), 3);
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId), 2);

  await client.cmdAndWait(client.cmds.setUsername(roomId, firstUserId, 'Jim'));
  await client.cmdAndWait(client.cmds.setUsername(roomId, secondUserId, 'John'));

  await client.cmdAndWait(client.cmds.toggleExclude(roomId, firstUserId, firstUserId));
  await client.cmdAndWait(client.cmds.toggleExclude(roomId, firstUserId, firstUserId));

  await client.cmdAndWait(client.cmds.toggleExclude(roomId, secondUserId, firstUserId));
  await client.cmdAndWait(client.cmds.toggleExclude(roomId, secondUserId, firstUserId));

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});

test('roomSettingsTest:  user configures room (cardConfig and autoReveal)', async () => {
  const outputFile = path.join(clientEventActionReducerScenarioDir, 'roomSettingsTest.json');

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();

  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId), 3);
  await client.cmdAndWait(client.cmds.setUsername(roomId, firstUserId, 'Jim'));

  await client.cmdAndWait(
    client.cmds.setCardConfig(roomId, firstUserId, [
      {value: 0, color: 'green', label: 'yes'},
      {value: 1, color: 'red', label: 'no'}
    ])
  );

  await client.cmdAndWait(client.cmds.toggleAutoReveal(roomId, firstUserId));
  await client.cmdAndWait(client.cmds.toggleAutoReveal(roomId, firstUserId));

  // in the end, write to file and close socket
  await client.dumpAllEvents(outputFile);
  client.disconnect();
});
