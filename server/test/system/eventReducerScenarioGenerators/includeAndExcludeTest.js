import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('includeAndExclude: two users, one excludes and includes himself. Then second user excludes&includes first user', async () => {
  const outputFilename = 'includeAndExcludeTest.json';

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
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
