const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * Migrates object "users" (key is userId) to array of users
   */
  async up(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && !Array.isArray(room.users)) {
          room.users = Object.values(room.users);
          migrateUtil.toBulkOps(ops, room);
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  },

  /**
   * Migrates array "users" back to object (key is userId)
   */
  async down(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && Array.isArray(room.users)) {
          room.users = migrateUtil.indexById(room.users);
          migrateUtil.toBulkOps(ops, room);
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  }
};
