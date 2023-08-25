/**
 * A user manually "settles" on a value for a story. (hopefully after a discussion with everybody in the room).
 * This will produce "consensusAchieved".
 * This saves the team the time to start a new round where everybody has to estimate the same value.
 *
 * Compared to the "setStoryValue" command (introduced in #364), which can be used for all stories, at any given time, this can only be used for the currently selected story. After it was revealed.
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
              format: 'uuid'
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

    // initially this was implemented. was then removed with #253, and re-added with #364 and the introduction of "setStoryValue" command
    if (room.selectedStory !== command.payload.storyId) {
      throw new Error('Can only settle estimation for currently selected story!');
    }

    if (!matchingStory.revealed) {
      throw new Error('You cannot settle estimation for a story that was NOT YET revealed!');
    }
  },
  fn: (pushEvent, room, command) => {
    pushEvent('consensusAchieved', {
      storyId: command.payload.storyId,
      value: command.payload.value,
      settled: true
    });
  }
};

export default settleEstimationCommandHandler;
