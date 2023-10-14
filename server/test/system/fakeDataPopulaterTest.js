import {faker} from '@faker-js/faker';
import poinzSocketClientFactory from './poinzSocketClient.js';
import uuid from '../../src/uuid.js';

/* SET YOUR ROOM ID HERE and remove .skip */
const ROOM_ID = 'sergio';

const getUsernameAtLeastThreeChars = () => {
  let username = faker.person.firstName();
  if (username.length < 3) {
    username += username + '-2';
  }
  return username;
};

describe.skip(`populating room "${ROOM_ID}" with fake data`, () => {
  /**
   * Use this "test" to add a bunch of dummy users to a running Poinz room. Good for testing & debugging and UI tweaking.
   */
  test('adds fake users to your Poinz room', async () => {
    const userCount = 14;
    for (let u = 0; u < userCount; u++) {
      const client = poinzSocketClientFactory();
      const userId = uuid();
      await client.cmdAndWait(client.cmds.joinRoom(ROOM_ID, userId, faker.person.firstName()), 2);
      await client.cmdAndWait(client.cmds.setAvatar(ROOM_ID, userId, u), 1);
    }

    // do not disconnect sockets, we want to leave users "online" in room.
    // as a consequence, jest test runner will not stop...
  });

  /**
   * Use this "test" to add dummy stories
   */
  test('adds fake stories to your Poinz room', async () => {
    const userId = uuid();
    const client = poinzSocketClientFactory();
    await client.cmdAndWait(
      client.cmds.joinRoom(ROOM_ID, userId, getUsernameAtLeastThreeChars()),
      2
    );

    const storyCount = 3;

    for (let s = 0; s < storyCount; s++) {
      const storyTitle = faker.hacker.ingverb() + ' ' + faker.hacker.noun();
      const storyDescription = faker.hacker.phrase() + '\n' + faker.hacker.phrase();
      await client.cmdAndWait(
        client.cmds.addStory(ROOM_ID, userId, storyTitle, storyDescription),
        1
      );
    }

    await client.cmdAndWait(client.cmds.leaveRoom(ROOM_ID, userId, false), 1);

    client.disconnect();
  });
});

describe.skip('Populating N fake rooms', () => {
  test('adds fake PoinZ rooms', async () => {
    const roomCount = 2040;
    for (let r = 0; r < roomCount; r++) {
      const client = poinzSocketClientFactory();
      const userId = uuid();
      let roomName = faker.music.songName().toLowerCase();
      roomName = roomName.replaceAll(/[^a-z0-9_-]/g, '_'); // make room name compliant
      await client.cmdAndWait(
        client.cmds.joinRoom(roomName, userId, getUsernameAtLeastThreeChars()),
        2
      );

      // stories
      const storyCount = Math.floor(Math.random() * 4);

      for (let s = 0; s < storyCount; s++) {
        const storyTitle = faker.hacker.ingverb() + ' ' + faker.hacker.noun();
        const storyDescription = faker.hacker.phrase() + '\n' + faker.hacker.phrase();
        await client.cmdAndWait(
          client.cmds.addStory(roomName, userId, storyTitle, storyDescription),
          1
        );
      }
    }
    console.log(` added ${roomCount} rooms...`);

    // do not disconnect sockets, we want to leave users "online" in room.
    // as a consequence, jest test runner will not stop...
  }, 60000);
});
