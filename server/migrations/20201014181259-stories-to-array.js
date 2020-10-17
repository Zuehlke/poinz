const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * Migrates object "stories" (key is storyId) to array of stories
   */
  async up(db) {
    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.stories && !Array.isArray(room.stories)) {
          room.stories = Object.values(room.stories);
          return db.collection('rooms').replaceOne({_id: room._id}, room, {upsert: true});
        }
      });
  },

  /**
   * Migrates array "stories" back to object (key is storyId)
   */
  async down(db) {
    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.stories && Array.isArray(room.stories)) {
          room.stories = migrateUtil.indexById(room.stories);
          return db.collection('rooms').replaceOne({_id: room._id}, room, {upsert: true});
        }
      });
  }
};
