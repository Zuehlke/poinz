import uuid from '../../src/uuid';
import initDb from './db';
import removeUsersWithoutName from '../../migrations/20220301180047-remove-users-without-username';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: remove users without a username (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'I-am-ok'
      },
      {
        id: uuid(),
        avatar: 0,
        username: undefined
      },
      {
        id: uuid(),
        avatar: 0
        // missing property
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
  const bWriteResult = await removeUsersWithoutName.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  expect(Array.isArray(room.users)).toBe(true);

  // only one user left in room
  expect(room.users.length).toBe(1);
  expect(room.users[0]).toEqual(preRoom.users[0]);

  expect(room.stories).toEqual(preRoom.stories); // unchanged
});
