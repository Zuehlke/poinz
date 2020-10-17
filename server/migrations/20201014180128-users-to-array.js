const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * Migrates object "users" (key is userId) to array of users
   */
  async up(db) {
    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && !Array.isArray(room.users)) {
          room.users = Object.values(room.users);
          return db.collection('rooms').replaceOne({_id: room._id}, room, {upsert: true});
        }
      });
  },

  /**
   * Migrates array "users" back to object (key is userId)
   */
  async down(db) {
    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && Array.isArray(room.users)) {
          room.users = migrateUtil.indexById(room.users);
          return db.collection('rooms').replaceOne({_id: room._id}, room, {upsert: true});
        }
      });
  }
};
