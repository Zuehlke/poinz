import {toBulkOps} from '../migrate-util.js';

/**
 * sets "avatar" on user to 0
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.users && Array.isArray(room.users)) {
        room.users = room.users.map((user) => {
          if (!user.avatar) {
            user.avatar = 0;
          }
          return user;
        });
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}

/**
 * cannot undo
 */
export async function down() {}
