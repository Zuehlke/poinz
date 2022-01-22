import {getMatchingStoryOrThrow} from './commonPreconditions';

/**
 * A user "trashes" a story  (marked as trashed, still in room).
 *
 * If the story that is "trashed" is the selectedStory in the room, an additional "storySelected" event is produced
 */

const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {
            storyId: {
              type: 'string',
              format: 'uuid'
            }
          },
          required: ['storyId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const trashStoryCommandHandler = {
  schema,
  preCondition: (room, command) => {
    getMatchingStoryOrThrow(room, command.payload.storyId);
  },
  fn: (pushEvent, room, command) => {
    pushEvent('storyTrashed', command.payload);

    if (room.selectedStory === command.payload.storyId) {
      pushEvent('storySelected', {storyId: findNextStoryToSelect(room, command)});
    }
  }
};

export default trashStoryCommandHandler;

function findNextStoryToSelect(room, trashCommand) {
  const remainingStories = (room.stories || []).filter(
    (story) => !story.trashed && story.id !== trashCommand.payload.storyId
  );

  if (remainingStories.length > 0) {
    return remainingStories[0].id;
  }
  return undefined;
}
