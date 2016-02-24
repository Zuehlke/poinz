module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (command.payload.userId !== userId) {
      throw new Error('Can only leave if userId in command payload matches!');
    }
  },
  fn: function leaveRoom(room, command) {

    if (command.payload.connectionLost) {
      room.applyEvent('connectionLost', {userId: command.payload.userId});
    } else {
      room.applyEvent('leftRoom', {userId: command.payload.userId});
    }
  }
};
