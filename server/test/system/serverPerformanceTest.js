import {v4 as uuid} from 'uuid';

import poinzSocketClientFactory from './poinzSocketClient';

/**
 * These tests send commands over a real socket connection to a running PoinZ backend on localhost:3000
 *
 */

test('serverPerformance: Add 100 Stories', async () => {
  await addNstories(100);
});
test('serverPerformance: Add 1000 Stories', async () => {
  await addNstories(1000);
}, 60000);

async function addNstories(numberOfStoriesToAdd) {
  const client = poinzSocketClientFactory();
  const roomId = uuid();
  const userId = uuid();

  const eventCountBeforeAddingStories = 5;

  await client.cmdAndWait(client.cmds.joinRoom(roomId, userId), eventCountBeforeAddingStories);

  for (let i = 0; i < numberOfStoriesToAdd; i++) {
    await client.cmdAndWait(
      client.cmds.addStory(roomId, userId, `story-${i}`, 'This is a story'),
      1 // just storyAdded, the room contains the sample story already
    );
  }

  expect(client.getAllReceivedEvents().length).toBe(
    eventCountBeforeAddingStories + numberOfStoriesToAdd
  );

  console.log('disconnecting');
  client.disconnect();
}

test('serverPerformance: join 100 users to same room', async () => {
  const roomId = uuid();

  const numberOfUsers = 30;
  const numberOfEventsForFirstJoin = 5; // 5 events on first join, when room gets created: roomCreated, joinedRoom, avatarSet, storyAdded, storySelected
  const numberOfEventsForOtherJoins = 2; //   2 events for all suceeding users :joinedRoom, avatarSet

  const clientPromises = new Array(numberOfUsers).fill(1).map(async (_, index) => {
    const client = poinzSocketClientFactory();
    const userId = uuid();

    const numberOfEventsOnJoin =
      index === 0 ? numberOfEventsForFirstJoin : numberOfEventsForOtherJoins;
    await client.cmdAndWait(client.cmds.joinRoom(roomId, userId), numberOfEventsOnJoin);
    await client.cmdAndWait(client.cmds.setUsername(roomId, userId, 'testuser-' + index), 1);

    return client;
  });

  await Promise.all(clientPromises).then((clients) => {
    clients.forEach((c) => c.disconnect());
  });
}, 60000);
