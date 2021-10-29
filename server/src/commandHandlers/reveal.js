/**
 * A user manually reveals estimates for a certain story
 * Users may only reveal the currently selected story
 * If story is already revealed, reject command.
 *
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
            }
          },
          required: ['storyId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const revealCommandHandler = {
  schema,
  preCondition: (room, command) => {
    if (room.selectedStory !== command.payload.storyId) {
      throw new Error('Can only reveal currently selected story!');
    }

    const matchingStory = getMatchingStoryOrThrow(room, command.payload.storyId);

    if (matchingStory.revealed) {
      throw new Error('Story is already revealed');
    }
  },
  fn: (pushEvent, room, command) => {
    pushEvent('revealed', {
      storyId: command.payload.storyId,
      manually: true
    });

    const matchingStory = getMatchingStoryOrThrow(room, command.payload.storyId);
    const estimValues = Object.values(matchingStory.estimations);
    if (allEstimationsSame(estimValues)) {
      pushEvent('consensusAchieved', {
        storyId: command.payload.storyId,
        value: estimValues[0]
      });
    }
  }
};

function allEstimationsSame(estimationValues) {
  if (estimationValues.length < 1) {
    return false;
  }
  const firstValue = estimationValues[0];
  return estimationValues.every((est) => est === firstValue);
}

export default revealCommandHandler;
