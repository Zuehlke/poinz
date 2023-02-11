import uuid from '../../src/uuid';
import poinzSocketClientFactory from './poinzSocketClient';
import {faker} from '@faker-js/faker';

/**
 * These tests send commands over a real socket connection to a running Poinz backend on localhost:3000
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

  const eventCountBeforeAddingStories = 6;

  await client.cmdAndWait(
    client.cmds.joinRoom(roomId, userId, faker.name.firstName()),
    eventCountBeforeAddingStories
  );

  for (let i = 0; i < numberOfStoriesToAdd; i++) {
    await client.cmdAndWait(
      client.cmds.addStory(roomId, userId, `story-${i}`, 'This is a story'),
      1 // just storyAdded, the room contains the sample story already
    );
  }

  expect(client.getAllReceivedEvents().length).toBe(
    eventCountBeforeAddingStories + numberOfStoriesToAdd
  );

  client.disconnect();
}

test('serverPerformance: join 30 users to same room', async () => {
  const roomId = uuid();

  const numberOfUsers = 30;
  const numberOfEventsForFirstJoin = 6; // 6 events on first join, when room gets created: roomCreated, joinedRoom, usernameSet, avatarSet, storyAdded, storySelected
  const numberOfEventsForOtherJoins = 3; //   2 events for all succeeding users :joinedRoom, usernameSet, avatarSet

  console.log(`adding ${numberOfUsers} users to room ${roomId}`);
  const clientPromises = new Array(numberOfUsers).fill(1).map(async (_, index) => {
    const client = poinzSocketClientFactory();
    const userId = uuid();

    const numberOfEventsOnJoin =
      index === 0 ? numberOfEventsForFirstJoin : numberOfEventsForOtherJoins;
    await client.cmdAndWait(
      client.cmds.joinRoom(roomId, userId, 'testuser-' + index),
      numberOfEventsOnJoin
    );

    return client;
  });

  await Promise.all(clientPromises).then((clients) => {
    clients.forEach((c) => c.disconnect());
  });
}, 60000);
