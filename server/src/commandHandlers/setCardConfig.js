/**
 * A user sets a custom card configuration on the room.
 */
const setCardConfigCommandHandler = {
  fn: (room, command) => {
    room.applyEvent('cardConfigSet', command.payload);
  }
};

export default setCardConfigCommandHandler;
