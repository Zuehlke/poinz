import {throwIfUserIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user sets his avatar. Identified with a number, starting with 1.
 * Only the client (App) knows which and how many avatars exist and also which number maps to which avatar.
 */
const setAvatarCommandHandler = {
  preCondition: (room, command, userId) => {
    throwIfUserIdNotFoundInRoom(room, userId);
  },
  fn: (room, command) => {
    room.applyEvent('avatarSet', command.payload);
  }
};

export default setAvatarCommandHandler;
