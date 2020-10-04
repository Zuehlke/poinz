import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

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
              format: 'uuidv4'
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
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);

    if (!room.stories[command.payload.storyId].trashed) {
      throw new Error(
        `Given story ${command.payload.storyId} in room ${room.id} is not marked as "trashed". Nothing to restore...`
      );
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyRestored', command.payload);

    if (!room.selectedStory) {
      room.applyEvent('storySelected', {storyId: command.payload.storyId});
    }
  }
};

export default restoreStoryCommandHandler;
