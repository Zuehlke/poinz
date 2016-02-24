/**
 * A user sets or unsets himself as visitor (payload contains flag)
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set visitor flag for own user!');
    }
  },
  fn: function setUsername(room, command) {
    if (command.payload.isVisitor) {
      room.applyEvent('visitorSet', {userId: command.payload.userId});
    } else {
      room.applyEvent('visitorUnset', {userId: command.payload.userId});
    }
  }
};
