import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user "trashes" a story  (marked as trashed, still in room)
 */
const trashStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storyTrashed', command.payload);
  }
};

export default trashStoryCommandHandler;
