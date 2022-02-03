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
  await dumpEventsToFile(clientA.getAllReceivedEvents(), outputFilename);
  clientA.disconnect();
  clientB.disconnect();
});

test('joinAndLeaveWithPassword', async () => {
  const outputFilename = 'roomJoiningAndLeavingWithPasswordTest.json';

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
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
