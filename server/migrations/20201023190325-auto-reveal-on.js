import {toBulkOps} from '../migrate-util.js';

/**
 * sets autoReveal "true" on all rooms that do not have the property set to either true or false.
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.autoReveal !== true && room.autoReveal !== false) {
        room.autoReveal = true;
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}

/**
 * removes autoReveal flag on every room
 */
export async function down(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      delete room.autoReveal;
      toBulkOps(ops, room);
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}
