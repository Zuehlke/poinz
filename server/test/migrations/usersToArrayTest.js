import uuid from '../../src/uuid';
import initDb from './db';
import usersToArray from '../../migrations/20201014180128-users-to-array';

test('DBMIGRATION: migrate users object to array (up)', async () => {
  const [db, roomz] = await initDb();

  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: {
      'a5244224-4200-4c17-bc27-f7e05dcd0018': {
        id: 'a5244224-4200-4c17-bc27-f7e05dcd0018',
        username: 'ScrumMaster',
        avatar: null,
        disconnected: true
      },
      'cf35de30-962f-4126-a5ac-f2f83cc4133d': {
        id: 'cf35de30-962f-4126-a5ac-f2f83cc4133d',
        username: 'Alex',
        avatar: 9,
        disconnected: true
      },
      '02447407-a841-470c-bc42-fa338d172654': {
        id: '02447407-a841-470c-bc42-fa338d172654',
        username: 'Ronny',
        avatar: null,
        disconnected: true
      }
    },
    stories: {
      '7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d': {
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
    }
  };
  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await usersToArray.up(db);
  if (bWriteResult.modifiedCount !== 1) {
    throw new Error('do not run migration tests simultaneously!');
  }

  const room = await roomz.findOne({id: roomId});

  // "users" is now an array
  expect(Array.isArray(room.users)).toBe(true);
  expect(room.users.length).toBe(3);
  expect(room.users[0]).toMatchObject(preRoom.users['a5244224-4200-4c17-bc27-f7e05dcd0018']);
  expect(room.users[1]).toMatchObject(preRoom.users['cf35de30-962f-4126-a5ac-f2f83cc4133d']);

  expect(room.stories).toEqual(preRoom.stories); // "stories" untouched
});

test('DBMIGRATION: migrate users array back to object (down)', async () => {
  const [db, roomz] = await initDb();

  // insert "new" room with "users" as array
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
        avatar: null,
        disconnected: true
      }
    ],
    stories: {
      '7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d': {
        title: '11472',
        description: '',
        id: '7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d',
        estimations: {
          '980106ea-3fdf-43ab-bcd7-d427470fbc88': 5,
          '68a24279-a9a1-41a0-bb11-2706e5c773f8': 5,
          'cf35de30-962f-4126-a5ac-f2f83cc4133d': 5
        },
        createdAt: 1599469016288.0,
        revealed: true,
        trashed: true
      }
    }
  };
  await roomz.insertOne(preRoom);

  // migrate "down"
  const bWriteResult = await usersToArray.down(db);
  if (bWriteResult.modifiedCount !== 1) {
    throw new Error('do not run migration tests simultaneously!');
  }

  const room = await roomz.findOne({id: roomId});

  // "users" is an object again
  expect(room.users['a5244224-4200-4c17-bc27-f7e05dcd0018']).toMatchObject(preRoom.users[0]);
  expect(room.users['cf35de30-962f-4126-a5ac-f2f83cc4133d']).toMatchObject(preRoom.users[1]);
  expect(room.users['02447407-a841-470c-bc42-fa338d172654']).toMatchObject(preRoom.users[2]);

  expect(room.stories).toEqual(preRoom.stories); // stories untouched
});
