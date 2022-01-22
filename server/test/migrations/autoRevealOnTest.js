import uuid from '../../src/uuid';
import initDb from './db';
import autoRevealOn from '../../migrations/20201023190325-auto-reveal-on';
import {throwIfBulkWriteResultInvalid} from './migrationTestUtil';

test('DBMIGRATION: set autoReveal flag on every room (up)', async () => {
  const [db, roomz] = await initDb();

  // insert room
  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [],
    stories: {}
    // flag does not exist
  };

  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await autoRevealOn.up(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // autoReveal is set
  expect(room.autoReveal).toBe(true);
});

test('DBMIGRATION: do not change autoReveal flag (when set to false) (up)', async () => {
  const [db, roomz] = await initDb();

  // insert room
  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [],
    stories: {},
    autoReveal: false // for some reason, this room has the flag already set
  };

  await roomz.insertOne(preRoom);

  // migrate "up"
  const bWriteResult = await autoRevealOn.up(db);
  expect(bWriteResult).toBeUndefined();

  const room = await roomz.findOne({id: roomId});

  // autoReveal is still false
  expect(room.autoReveal).toBe(false);
});

test('DBMIGRATION: remove autoReveal flag on room (when set to false) (down)', async () => {
  const [db, roomz] = await initDb();

  // insert room
  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [],
    stories: {},
    autoReveal: false
  };

  await roomz.insertOne(preRoom);

  // migrate "down"
  const bWriteResult = await autoRevealOn.down(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // autoReveal is no longer set
  expect(room.autoReveal).toBeUndefined();
});

test('DBMIGRATION: remove autoReveal flag on room (when set to true) (down)', async () => {
  const [db, roomz] = await initDb();

  // insert room
  const roomId = uuid();
  const preRoom = {
    id: roomId,
    users: [],
    stories: {},
    autoReveal: true
  };

  await roomz.insertOne(preRoom);

  // migrate "down"
  const bWriteResult = await autoRevealOn.down(db);
  throwIfBulkWriteResultInvalid(bWriteResult);

  const room = await roomz.findOne({id: roomId});

  // autoReveal is no longer set
  expect(room.autoReveal).toBeUndefined();
});
