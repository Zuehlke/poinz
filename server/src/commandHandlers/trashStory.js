import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

/**
 * A user "trashes" a story  (marked as trashed, still in room).
 *
 * If the story that is "trashed" is the selectedStory in the room, an additional "storySelected" event is produced
 */
const trashStoryCommandHandler = {
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storyTrashed', command.payload);

    if (room.get('selectedStory') === command.payload.storyId) {
      room.applyEvent('storySelected', {storyId: findNextStoryToSelect(room, command)});
    }
  }
};

export default trashStoryCommandHandler;

function findNextStoryToSelect(room, trashCommand) {
  const remainingStories = room
    .get('stories')
    .valueSeq()
    .filter((story) => !story.get('trashed') && story.get('id') !== trashCommand.payload.storyId);
  const firstRemainingStory = remainingStories.first();

  if (firstRemainingStory) {
    return firstRemainingStory.get('id');
  }
  return undefined;
}
