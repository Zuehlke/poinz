const {faker} = require('@faker-js/faker');

import poinzSocketClientFactory from './poinzSocketClient.js';
import uuid from '../../src/uuid.js';

/* SET YOUR ROOM ID HERE*/
const ROOM_ID = 'bxgut1lr5a9im8xi9ap67';

/**
 * Use this "test" to add a bunch of dummy users to a running PoinZ room. Good for testing & debugging and UI tweaking.
 */
test('adds fake users to your PoinZ room', async () => {
  const userCount = 14;
  for (let u = 0; u < userCount; u++) {
    const client = poinzSocketClientFactory();
    const userId = uuid();
    await client.cmdAndWait(client.cmds.joinRoom(ROOM_ID, userId, faker.name.firstName()), 2);
    await client.cmdAndWait(client.cmds.setAvatar(ROOM_ID, userId, u), 1);
  }

  // do not disconnect sockets, we want to leave users "online" in room.
  // as a consequence, jest test runner will not stop...
});

/**
 * Use this "test" to add dummy stories
 */
test.skip('adds fake stories to your PoinZ room', async () => {
  const userId = uuid();
  const client = poinzSocketClientFactory();
  await client.cmdAndWait(client.cmds.joinRoom(ROOM_ID, userId, faker.name.firstName()), 2);

  const storyCount = 3;

  for (let s = 0; s < storyCount; s++) {
    const storyTitle = faker.hacker.ingverb() + ' ' + faker.hacker.noun();
    const storyDescription = faker.hacker.phrase() + '\n' + faker.hacker.phrase();
    await client.cmdAndWait(client.cmds.addStory(ROOM_ID, userId, storyTitle, storyDescription), 1);
  }

  await client.cmdAndWait(client.cmds.leaveRoom(ROOM_ID, userId, false), 1);

  client.disconnect();
});
