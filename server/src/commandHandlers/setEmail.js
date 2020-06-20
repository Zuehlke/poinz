import {throwIfUserIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user sets his email address (used for Gravatar image fetching. See https://en.gravatar.com/ ).
 */
module.exports = {
  preCondition: (room, command, userId) => {
    throwIfUserIdNotFoundInRoom(room, userId);
  },
  fn: (room, command) => {
    room.applyEvent('emailSet', command.payload);
  }
};
