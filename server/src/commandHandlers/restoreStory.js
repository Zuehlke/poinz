import {getMatchingStoryOrThrow} from './commonPreconditions';

/**
 * A user restores a story.
 * A story must be first marked as "trashed", before it can be restored.
 * Story will no longer be marked as "trashed".
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

const restoreStoryCommandHandler = {
  schema,
  preCondition: (room, command) => {
    const matchingStory = getMatchingStoryOrThrow(room, command.payload.storyId);

    if (!matchingStory.trashed) {
      throw new Error(
        `Given story ${command.payload.storyId} in room ${room.id} is not marked as "trashed". Nothing to restore...`
      );
    }
  },
  fn: (pushEvent, room, command) => {
    pushEvent('storyRestored', command.payload);

    if (!room.selectedStory) {
      pushEvent('storySelected', {storyId: command.payload.storyId});
    }
  }
};

export default restoreStoryCommandHandler;
