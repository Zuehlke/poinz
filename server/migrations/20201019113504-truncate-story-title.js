import {toBulkOps} from '../migrate-util.js';

/**
 * truncates story titles that are longer than 100 chars
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.stories && Array.isArray(room.stories)) {
        let atLeastOneStoryModified = false;
        room.stories = room.stories.map((stry) => {
          if (stry.title.length > 100) {
            atLeastOneStoryModified = true;
            stry.title = stry.title.substr(0, 100);
          }
          return stry;
        });

        if (atLeastOneStoryModified) {
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
