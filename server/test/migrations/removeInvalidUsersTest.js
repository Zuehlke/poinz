import uuid from '../../src/uuid';
import initDb from './db';
import removeInvalidUsers from '../../migrations/20201019095546-remove-invalid-users';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: remove users without "id" (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'valid'
      },
      {
        /* id missing */
        disconnecte: false
      }
    ]
  };
  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await removeInvalidUsers.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // "users" is now stripped of the invalid user
  expect(Array.isArray(room.users)).toBe(true);
  expect(room.users.length).toBe(1);
  expect(room.users[0]).toMatchObject(preRoom.users[0]);

  expect(room.stories).toEqual(preRoom.stories); // "stories" untouched
});

test('DBMIGRATION: room with only valid users (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoomOne = {
    id: roomId,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'valid'
      },
      {
        id: uuid(),
        avatar: 0,
        username: 'also valid',
        disconnected: false,
        email: 'some.email@test.de',
        emailHas: 'wouldbethehash'
      }
    ]
  };

  const roomIdTwo = uuid();
  const preRoomTwo = {
    id: roomIdTwo,
    users: [
      {
        id: uuid(),
        avatar: 0,
        username: 'valid'
      },
      {
        /* id missing */
        avatar: 0,
        disconnected: false
      }
    ]
  };
  await roomz.insertOne(preRoomOne);
  await roomz.insertOne(preRoomTwo);

  // migrate "up"
  const bWriteResult = await removeInvalidUsers.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const roomOne = await roomz.findOne({id: roomId});
  const roomTwo = await roomz.findOne({id: roomIdTwo});

  // "users" in room two is now stripped of the invalid user
  expect(roomTwo.users.length).toBe(1);
  expect(roomTwo.users[0]).toMatchObject(preRoomTwo.users[0]);

  // "users" in room one is still the same
  expect(roomOne.users.length).toBe(2);
  expect(roomOne.users).toMatchObject(preRoomOne.users);
});
