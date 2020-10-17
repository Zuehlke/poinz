const migrateUtil = require('../migrate-util');

module.exports = {
  /**
   * sets "avatar" on user to 0
   */
  async up(db) {
    await db
      .collection('rooms')
      .find({})
      .forEach((room) => {
        if (room.users && Array.isArray(room.users)) {
          room.users = room.users.map((user) => {
            if (!user.avatar) {
              user.avatar = 0;
            }
          });
          return db.collection('rooms').replaceOne({_id: room._id}, room, {upsert: true});
        }
      });
  },

  /**
   * cannot undo
   */
  async down() {}
};
