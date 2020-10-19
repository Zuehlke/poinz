const migrateUtil = require('../migrate-util');

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 80;

module.exports = {
  /**
   * fixes username length criteria
   */
  async up(db) {
    const ops = [];

    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && Array.isArray(room.users)) {
          let atLeastOneUserModified = false;
          room.users = room.users.map((usr) => {
            if (!usr.username) {
              return usr;
            }

            const usrNameLength = usr.username.length;

            if (usrNameLength < USERNAME_MIN_LENGTH) {
              atLeastOneUserModified = true;
              usr.username = '_'.repeat(USERNAME_MIN_LENGTH - usrNameLength) + usr.username;
            } else if (usrNameLength > USERNAME_MAX_LENGTH) {
              atLeastOneUserModified = true;
              usr.username = usr.username.substr(0, USERNAME_MAX_LENGTH);
            }

            return usr;
          });

          if (atLeastOneUserModified) {
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
