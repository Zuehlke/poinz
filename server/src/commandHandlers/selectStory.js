import {throwIfStoryIdNotFoundInRoom, throwIfStoryTrashed} from './commonPreconditions';

/**
 * A user selected a story (marked it as the "current" story to estimate)
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
              minLength: 1
            }
          },
          required: ['storyId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const selectStoryCommandHandler = {
  schema,
  preCondition: (room, command) => {
    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);
    throwIfStoryTrashed(room, command.payload.storyId);
  },
  fn: (room, command) => {
    room.applyEvent('storySelected', {storyId: command.payload.storyId});
  }
};

export default selectStoryCommandHandler;
