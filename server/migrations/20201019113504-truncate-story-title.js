const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * truncates story titles that are longer than 100 chars
   */
  async up(db) {
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
            migrateUtil.toBulkOps(ops, room);
          }
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  },

  /**
   * cannot go back
   */
  async down() {}
};
