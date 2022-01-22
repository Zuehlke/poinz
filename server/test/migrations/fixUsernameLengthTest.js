import uuid from '../../src/uuid';
import initDb from './db';
import fixUsernameLength from '../../migrations/20201019134711-fix-username-length';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: fix length of username {3,80} (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'Mo' //  this is too short (min is 3 chars)
      },
      {
        id: uuid(),
        avatar: 0,
        username: 'This is just right'
      },
      {
        id: uuid(),
        avatar: 0,
        username: 'too-long' + '.'.repeat(85) // char limit is 80
      }
    ],
    stories: [
      {
        id: uuid(),
        title: 'just some story'
      }
    ]
  };
  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await fixUsernameLength.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  expect(Array.isArray(room.users)).toBe(true);
  expect(room.users.length).toBe(3);

  expect(room.users[0]).toMatchObject({
    ...preRoom.users[0],
    username: '_Mo'
  });

  expect(room.users[1]).toMatchObject(preRoom.users[1]); // unchanged

  expect(room.users[2]).toMatchObject({
    ...preRoom.users[2],
    username: 'too-long' + '.'.repeat(80 - 8) // truncated to 80 chars
  });

  expect(room.stories).toEqual(preRoom.stories); // unchanged
});
