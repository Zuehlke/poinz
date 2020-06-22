import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user deletes a story.
 * A story must be first marked as "trashed", before it can be deleted.
 * Story will be completely removed from room.
 */
const deleteStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);

    const isTrashed = !!room.getIn(['stories', command.payload.storyId, 'trashed']);
    if (!isTrashed) {
      throw new Error(
        `Given story ${command.payload.storyId} in room ${room.get(
          'id'
        )} is not marked as "trashed". cannot delete it!`
      );
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyDeleted', command.payload);
  }
};

export default deleteStoryCommandHandler;
