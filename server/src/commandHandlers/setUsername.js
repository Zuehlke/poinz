/**
 * A user sets his username
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set username for own user!');
    }
  },
  fn: function setUsername(room, command) {
    room.applyEvent('usernameSet', command.payload);
  }
};
