import {toBulkOps} from '../migrate-util.js';

/**
 * removes users that have no "id" field
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.users && Array.isArray(room.users)) {
        const lengthBeforeFiltering = room.users.length;
        room.users = room.users.filter((usr) => usr.id);
        if (room.users.length !== lengthBeforeFiltering) {
          toBulkOps(ops, room);
        }
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}

/**
 * cannot go back
 */
export async function down() {}
