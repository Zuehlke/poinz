import {throwIfStoryIdNotFoundInRoom, throwIfStoryTrashed} from './commonPreconditions';

/**
 * A user changes the title and/or description of a story
 */
const changeStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
    throwIfStoryTrashed(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storyChanged', command.payload);
  }
};

export default changeStoryCommandHandler;
