/**
 * A user selected a story (marked it as the "current" story to estimate)
 */
import {throwIfStoryIdNotFoundInRoom, throwIfStoryTrashed} from './commonPreconditions';

const selectStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
    throwIfStoryTrashed(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storySelected', {storyId: command.payload.storyId});
  }
};

export default selectStoryCommandHandler;
