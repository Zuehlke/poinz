import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('Two users, one disconnects, you kick him', async () => {
  const outputFilename = 'disconnectAndKickTest.json';

  // we need two clients, since on "connectionLost" , server removes socket of "leaving" user from room
  const clientA = poinzSocketClientFactory();
  const clientB = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();

  const eventsFromJoin = await clientA.cmdAndWait(
    clientA.cmds.joinRoom(roomId, firstUserId, 'Jim'),
    6
  );

  await clientB.cmdAndWait(clientB.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  // second user estimates default (sample) story

  const storyAddedEvent = eventsFromJoin[4];
  await clientB.cmdAndWait(
    clientB.cmds.giveEstimate(roomId, secondUserId, storyAddedEvent.payload.storyId, 8)
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
  await dumpEventsToFile(clientA.getAllReceivedEvents(), outputFilename);
  clientA.disconnect();
  clientB.disconnect();
});
