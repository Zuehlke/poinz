import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('joinAndLeave', async () => {
  const outputFilename = 'roomJoiningAndLeavingTest.json';

  // we need two clients, since on "connectionLost" and "leftRoom", server removes socket of "leaving" user from room
  const clientA = poinzSocketClientFactory();
  const clientB = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  // first user joins, adds story, estimates it alone
  const firstJoinEvents = await clientA.cmdAndWait(
    clientA.cmds.joinRoom(roomId, firstUserId, 'Jim'),
    6
  );

  await clientA.cmdAndWait(
    clientA.cmds.giveEstimate(roomId, firstUserId, firstJoinEvents[4].payload.storyId, 4, 1),
    3 // given, revealed, consensus
  );

  // second user joins room with already a estimated story in it
  await clientB.cmdAndWait(clientB.cmds.joinRoom(roomId, secondUserId, 'John'), 3);
  await clientB.cmdAndWait(clientB.cmds.setEmail(roomId, secondUserId, 'test.johnny@gmail.com'));

  const cmdId = clientA.cmds.leaveRoom(roomId, firstUserId);
  await clientB.waitForEvents(cmdId, 1); // leftRoom

  // in the end, write to file and close socket
  await dumpEventsToFile(clientA.getAllReceivedEvents(), outputFilename);
  clientA.disconnect();
  clientB.disconnect();
});

test('joinAndLeaveWithPassword', async () => {
  const outputFilename = 'roomJoiningAndLeavingWithPasswordTest.json';

  const roomId = uuid();

  const client = poinzSocketClientFactory();
  const userId = uuid();

  //  user joins, creates room on the fly
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com'),
    3
  );

  // user sets password
  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, '1234'), 1);

  // user leaves
  await client.cmdAndWait(client.cmds.leaveRoom(roomId, userId), 1);

  //  user re-joins, with correct password
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com', '1234'),
    4
  );

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
