import uuid from '../../src/uuid';
import initDb from './db';
import truncateStoryTitle from '../../migrations/20201019113504-truncate-story-title';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: truncate story title if longer than 100 chars (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'John'
      }
    ],
    stories: [
      {
        id: uuid(),
        title: 'this is a valid story title'
      },
      {
        id: uuid(),
        title: '-'.repeat(101),
        description: 'untouched...'
      }
    ]
  };
  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await truncateStoryTitle.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // "stories" array still contains both stories
  expect(Array.isArray(room.stories)).toBe(true);
  expect(room.stories.length).toBe(2);
  expect(room.stories[0]).toMatchObject(preRoom.stories[0]);
  expect(room.stories[1]).toMatchObject({
    title: '-'.repeat(100),
    description: 'untouched...'
  });

  expect(Array.isArray(room.users)).toBe(true);
  expect(room.users.length).toBe(1);
});
