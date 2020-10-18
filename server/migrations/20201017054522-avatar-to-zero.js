const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * sets "avatar" on user to 0
   */
  async up(db) {
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
          migrateUtil.toBulkOps(ops, room);
        }
      });

    if (ops.length) {
      return db.collection('rooms').bulkWrite(ops);
    }
  },

  /**
   * cannot undo
   */
  async down() {}
};
