import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('Two users, one excludes and includes himself. Then second user excludes&includes first user', async () => {
  const outputFilename = 'includeAndExcludeTest.json';

  const client = poinzSocketClientFactory();

  const roomId = uuid();
  const firstUserId = uuid();
  const secondUserId = uuid();
  await client.cmdAndWait(client.cmds.joinRoom(roomId, firstUserId, 'Jim'), 6);
  await client.cmdAndWait(client.cmds.joinRoom(roomId, secondUserId, 'John'), 3);

  await client.cmdAndWait(client.cmds.toggleExclude(roomId, firstUserId, firstUserId));
  await client.cmdAndWait(client.cmds.toggleExclude(roomId, firstUserId, firstUserId));

  await client.cmdAndWait(client.cmds.toggleExclude(roomId, secondUserId, firstUserId));
  await client.cmdAndWait(client.cmds.toggleExclude(roomId, secondUserId, firstUserId));

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
