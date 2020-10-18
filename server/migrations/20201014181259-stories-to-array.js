const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * Migrates object "stories" (key is storyId) to array of stories
   */
  async up(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.stories && !Array.isArray(room.stories)) {
          room.stories = Object.values(room.stories);
          migrateUtil.toBulkOps(ops, room);
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  },

  /**
   * Migrates array "stories" back to object (key is storyId)
   */
  async down(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.stories && Array.isArray(room.stories)) {
          room.stories = migrateUtil.indexById(room.stories);
          migrateUtil.toBulkOps(ops, room);
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  }
};
