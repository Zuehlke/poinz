/**
 * A user sets or unsets himself as visitor (payload contains flag).
 * Emits event only if visitor state changed
 *
 * Visitors cannot estimate stories.
 *
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set visitor flag for own user!');
    }
  },
  fn: function setUsername(room, command) {
    const isCurrentlyVisitor = room.getIn(['users', command.payload.userId, 'visitor']);

    if (command.payload.isVisitor && !isCurrentlyVisitor) {
      room.applyEvent('visitorSet', {userId: command.payload.userId});
    } else if (!command.payload.isVisitor && isCurrentlyVisitor) {
      room.applyEvent('visitorUnset', {userId: command.payload.userId});
    }
  }
};
