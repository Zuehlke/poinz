/**
 * A user sets his username.
 */
const setUsernameCommandHandler = {
  existingRoom: true,
  preCondition: (room, command, userId) => {
    if (userId !== command.payload.userId) {
      throw new Error('Can only set username for own user!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('usernameSet', command.payload);
  }
};

export default setUsernameCommandHandler;
