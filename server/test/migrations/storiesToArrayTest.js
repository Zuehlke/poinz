import uuid from '../../src/uuid';
import initDb from './db';
import storiesToArray from '../../migrations/20201014181259-stories-to-array';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: migrate "stories" object to array (up)', async () => {
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
        avatar: 0,
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
        createdAt: 1599469016288,
        revealed: true,
        trashed: true
      },
      '4a1d1faa-4407-40ff-bad2-1de3a6a86e77': {
        id: '4a1d1faa-4407-40ff-bad2-1de3a6a86e77',
        title: 'Client Basket: New Info Product type',
        estimations: {
          'fc6bfba5-6f9c-4150-ad36-715c824a07a3': 8
        },
        createdAt: 1602919851440.0
      }
    }
  };

  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await storiesToArray.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // "stories" is now an array
  expect(Array.isArray(room.stories)).toBe(true);
  expect(room.stories.length).toBe(2);
  expect(room.stories[0]).toMatchObject(preRoom.stories['7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d']);
  expect(room.stories[1]).toMatchObject(preRoom.stories['4a1d1faa-4407-40ff-bad2-1de3a6a86e77']);

  expect(room.users).toEqual(preRoom.users); // users untouched
});

test('DBMIGRATION: migrate "stories" array back to object (down)', async () => {
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
        avatar: 0,
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
      },
      {
        id: '4a1d1faa-4407-40ff-bad2-1de3a6a86e77',
        title: 'Client Basket: New Info Product type',
        estimations: {
          'fc6bfba5-6f9c-4150-ad36-715c824a07a3': 8
        },
        createdAt: 1602919851440.0
      }
    ]
  };

  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await storiesToArray.down(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // "stories" is now an object again
  expect(Array.isArray(room.stories)).toBe(false);
  expect(room.stories['7fff9ca8-452c-4e7e-a9e2-e2fd2d7ac44d']).toMatchObject(preRoom.stories[0]);
  expect(room.stories['4a1d1faa-4407-40ff-bad2-1de3a6a86e77']).toMatchObject(preRoom.stories[1]);

  expect(room.users).toEqual(preRoom.users); // users untouched
});
