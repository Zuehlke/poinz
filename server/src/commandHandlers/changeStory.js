import {throwIfStoryTrashed} from './commonPreconditions';

/**
 * A user changes the title and/or description of a story
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
              type: 'string'
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 100
            },
            description: {
              type: 'string',
              minLength: 0,
              maxLength: 2000
            }
          },
          required: ['title', 'description', 'storyId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const changeStoryCommandHandler = {
  schema,
  preCondition: (room, command) => {
    throwIfStoryTrashed(room, command.payload.storyId);
  },
  fn: (pushEvent, room, command) => {
    pushEvent('storyChanged', command.payload);
  }
};

export default changeStoryCommandHandler;
