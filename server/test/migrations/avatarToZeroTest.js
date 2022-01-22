import uuid from '../../src/uuid';
import initDb from './db';
import avatarToZero from '../../migrations/20201017054522-avatar-to-zero';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: set avatar to zero if undefined or null (up)', async () => {
  const [db, roomz] = await initDb();

  // insert room with users
  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [
      {
        id: 'a5244224-4200-4c17-bc27-f7e05dcd0018',
        username: 'ScrumMaster',
        avatar: null,
        disconnected: true
      },
      {
        id: 'cf35de30-962f-4126-a5ac-f2f83cc4133d',
        username: 'Alex',
        avatar: 9,
        disconnected: true
      },
      {
        id: '02447407-a841-470c-bc42-fa338d172654',
        username: 'Ronny',
        avatar: undefined,
        disconnected: true
      }
    ],
    stories: [
      {
        title: '11472',
        description: '',
        id: '7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d',
        estimations: {
          '980106ea-3fdf-43ab-bcd7-d427470fbc88': 5,
          '68a24279-a9a1-41a0-bb11-2706e5c773f8': 5,
          'cf35de30-962f-4126-a5ac-f2f83cc4133d': 5
        },
        createdAt: 1599469016288,
        revealed: true,
        trashed: true
      }
    ]
  };

  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await avatarToZero.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // all users have now correctly set "avatar"
  expect(room.users.length).toBe(3);
  expect(room.users[0]).toMatchObject({
    id: 'a5244224-4200-4c17-bc27-f7e05dcd0018',
    avatar: 0
  });
  expect(room.users[1]).toMatchObject({
    id: 'cf35de30-962f-4126-a5ac-f2f83cc4133d',
    avatar: 9
  });
  expect(room.users[2]).toMatchObject({
    id: '02447407-a841-470c-bc42-fa338d172654',
    avatar: 0
  });
  expect(room.stories).toEqual(preRoom.stories); // "stories" untouched
});
