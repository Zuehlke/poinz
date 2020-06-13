/**
 * A user sets his username.
 */
const setUsernameCommandHandler = {
  fn: (room, command) => {
    room.applyEvent('usernameSet', command.payload);
  }
};

export default setUsernameCommandHandler;
