/**
 * A user changes the title and/or description of a story
 */
import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

const changeStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storyChanged', command.payload);
  }
};

export default changeStoryCommandHandler;
