/**
 * A user wants to leave the room.
 * Is also produced by the socketServer itself on connection lost!
 *
 */
const leaveRoomCommandHandler = {
  fn: (room, command) => {
    if (command.payload.connectionLost) {
      room.applyEvent('connectionLost', {});
    } else {
      room.applyEvent('leftRoom', {});
    }
  }
};

export default leaveRoomCommandHandler;
