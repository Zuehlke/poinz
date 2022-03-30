import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('Two users, he kicks you, you rejoin', async () => {
  const outputFilename = 'youGetKicked.json';

  // we need two clients, since on "connectionLost" , server removes socket of "leaving" user from room
  const clientA = poinzSocketClientFactory();
  const clientB = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid(); // you
  const secondUserId = uuid(); // him

  await clientA.cmdAndWait(clientA.cmds.joinRoom(roomId, firstUserId, 'Jim'), 6);

  await clientB.cmdAndWait(clientB.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  // second user kicks you
  await clientA.cmdAndWait(
    clientA.cmds.kick(roomId, secondUserId, firstUserId),
    1 // kicked
  );

  // you can rejoin
  await clientA.cmdAndWait(clientA.cmds.joinRoom(roomId, firstUserId, 'Jim'), 3);

  // in the end, write to file and close socket
  await dumpEventsToFile(clientA.getAllReceivedEvents(), outputFilename);
  clientA.disconnect();
  clientB.disconnect();
});
