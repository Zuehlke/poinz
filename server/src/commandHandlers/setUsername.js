import {throwIfUserIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user sets his username.
 */
const setUsernameCommandHandler = {
  preCondition: (room, command, userId) => {
    throwIfUserIdNotFoundInRoom(room, userId);
  },
  fn: (room, command) => {
    room.applyEvent('usernameSet', command.payload);
  }
};

export default setUsernameCommandHandler;
