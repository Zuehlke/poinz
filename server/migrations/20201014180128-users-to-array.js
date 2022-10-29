import {indexById, toBulkOps} from '../migrate-util.js';

/**
 * Migrates object "users" (key is userId) to array of users
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.users && !Array.isArray(room.users)) {
        room.users = Object.values(room.users);
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}

/**
 * Migrates array "users" back to object (key is userId)
 */
export async function down(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.users && Array.isArray(room.users)) {
        room.users = indexById(room.users);
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}
