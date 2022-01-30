import poinzSocketClientFactory from './poinzSocketClient.js';
import uuid from '../../src/uuid.js';

/**
 * Use this "test" to add a bunch of dummy users to a running PoinZ room. Good for testing & debugging and UI tweaking.
 */
test.skip('adding dummy rooms to running PoinZ room', async () => {
  await joinDummyUsers(10, '' /* SET YOUR ROOM ID HERE*/);
});

async function joinDummyUsers(userCount, roomId) {
  for (let u = 0; u < userCount; u++) {
    await joinSingleDummyUser(roomId, u);
  }
}

async function joinSingleDummyUser(roomId, index) {
  const client = poinzSocketClientFactory();
  const userId = uuid();
  await client.cmdAndWait(client.cmds.joinRoom(roomId, userId, 'Dummy-' + index), 2);
}
