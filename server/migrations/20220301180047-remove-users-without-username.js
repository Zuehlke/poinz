const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * Removes all users from a room that have no username set.
   */
  async up(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && !Array.isArray(room.users)) {
          throw new Error('Expected "room.users" to be defined and to be an array!');
        }

        if (room.users.findIndex((u) => !u.username) >= 0) {
          room.users = room.users.filter((u) => u.username);
          migrateUtil.toBulkOps(ops, room);
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
