import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user deletes a story
 */
const deleteStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storyDeleted', command.payload);
  }
};

export default deleteStoryCommandHandler;
