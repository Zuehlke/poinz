const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * removes users that have no "id" field
   */
  async up(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && Array.isArray(room.users)) {
          const lengthBeforeFiltering = room.users.length;
          room.users = room.users.filter((usr) => usr.id);
          if (room.users.length !== lengthBeforeFiltering) {
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
