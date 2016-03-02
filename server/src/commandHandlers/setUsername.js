/**
 * A user sets his username.
 * Event is only emitted if username actually changed.
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set username for own user!');
    }
  },
  fn: function setUsername(room, command) {
    if (room.getIn(['users', command.payload.userId, 'username']) !== command.payload.username) {
      room.applyEvent('usernameSet', command.payload);
    }
  }
};
