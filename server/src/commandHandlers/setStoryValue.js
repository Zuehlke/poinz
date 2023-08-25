/**
 * A user manually sets the value for a story.
 *
 * This command is used in the story estimation matrix and can be used for all stories, at any given time.
 */
import {getMatchingStoryOrThrow} from './commonPreconditions.js';

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
            },
            value: {
              type: 'number'
            }
          },
          required: ['storyId', 'value'],
          additionalProperties: false
        }
      }
    }
  ]
};

const setStoryValueCommandHandler = {
  schema,
  preCondition: (room, command) => {
    getMatchingStoryOrThrow(room, command.payload.storyId);
  },
  fn: (pushEvent, room, command) => {
    pushEvent('storyValueSet', {
      storyId: command.payload.storyId,
      value: command.payload.value
    });
  }
};

export default setStoryValueCommandHandler;
