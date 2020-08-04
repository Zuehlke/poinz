import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user restores a story.
 * A story must be first marked as "trashed", before it can be restored.
 * Story will no longer be marked as "trashed".
 */
const restoreStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);

    const isTrashed = !!room.getIn(['stories', command.payload.storyId, 'trashed']);
    if (!isTrashed) {
      throw new Error(
        `Given story ${command.payload.storyId} in room ${room.get(
          'id'
        )} is not marked as "trashed". Nothing to restore...`
      );
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyRestored', command.payload);

    if (!room.get('selectedStory')) {
      room.applyEvent('storySelected', {storyId: command.payload.storyId});
    }
  }
};

export default restoreStoryCommandHandler;
