import {indexById, toBulkOps} from '../migrate-util.js';

/**
 * Migrates object "stories" (key is storyId) to array of stories
 */
export async function up(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.stories && !Array.isArray(room.stories)) {
        room.stories = Object.values(room.stories);
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}

/**
 * Migrates array "stories" back to object (key is storyId)
 */
export async function down(db) {
  const ops = [];

  await db
    .collection('rooms')
    .find({})
    .forEach((room) => {
      if (room.stories && Array.isArray(room.stories)) {
        room.stories = indexById(room.stories);
        toBulkOps(ops, room);
      }
    });

  if (ops.length) {
    return db.collection('rooms').bulkWrite(ops);
  }
}
