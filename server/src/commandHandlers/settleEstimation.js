/**
 * A user manually "settles" on a value for a story. (hopefully after a discussion with everybody in the room).
 * This will produced "consensusAchieved".
 * This saves the team the time to start a new round and estimate the same value.
 */
import {getMatchingStoryOrThrow} from './commonPreconditions';

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

const settleEstimationCommandHandler = {
  schema,
  preCondition: (room, command) => {
    const matchingStory = getMatchingStoryOrThrow(room, command.payload.storyId);

    if (room.selectedStory !== command.payload.storyId) {
      throw new Error('Can only settle estimation for currently selected story!');
    }

    if (!matchingStory.revealed) {
      throw new Error('You cannot settle estimation for a story that was NOT YET revealed!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('consensusAchieved', {
      storyId: command.payload.storyId,
      value: command.payload.value,
      settled: true
    });
  }
};

export default settleEstimationCommandHandler;
