import uuid from '../../../src/uuid';
import poinzSocketClientFactory from '../poinzSocketClient';
import {dumpEventsToFile} from './index';

test('resetAndClearPassword', async () => {
  const outputFilename = 'resetAndClearPasswordTest.json';

  const roomId = uuid();

  const client = poinzSocketClientFactory();
  const userId = uuid();

  //  user joins, creates room on the fly
  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, 'super-creator', 'tst@gmail.com'),
    3
  );

  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, 'new-password'));

  await client.cmdAndWait(client.cmds.setPassword(roomId, userId, ''));

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
