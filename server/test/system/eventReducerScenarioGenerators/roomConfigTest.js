import poinzSocketClientFactory from '../poinzSocketClient';
import uuid from '../../../src/uuid';
import {dumpEventsToFile} from './index';

test('roomConfig:  user configures room (cardConfig and autoReveal/confidence/issueTrackingUrl)', async () => {
  const outputFilename = 'roomConfigTest.json';

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

  await client.cmdAndWait(
    client.cmds.setRoomConfig(roomId, firstUserId, {
      autoReveal: false,
      withConfidence: true,
      issueTrackingUrl: 'https://some.url.com'
    })
  );
  await client.cmdAndWait(
    client.cmds.setRoomConfig(roomId, firstUserId, {
      autoReveal: true,
      withConfidence: false,
      issueTrackingUrl: ''
    })
  );

  // in the end, write to file and close socket
  await dumpEventsToFile(client.getAllReceivedEvents(), outputFilename);
  client.disconnect();
});
