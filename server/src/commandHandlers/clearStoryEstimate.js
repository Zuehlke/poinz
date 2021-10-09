/**
 * A user clears his estimation value for a certain story.
 * Users may only clear estimation for the currently selected story.
 */
import {getMatchingStoryOrThrow, getMatchingUserOrThrow} from './commonPreconditions';

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

const clearStoryEstimateCommandHandler = {
  schema,
  preCondition: (room, command, userId) => {
    if (room.selectedStory !== command.payload.storyId) {
      throw new Error('Can only clear estimation for currently selected story!');
    }

    const matchingStory = getMatchingStoryOrThrow(room, command.payload.storyId);
    if (matchingStory.revealed) {
      throw new Error('You cannot clear your estimate for a story that was revealed!');
    }

    const matchingUser = getMatchingUserOrThrow(room, userId);
    if (matchingUser.excluded) {
      throw new Error('Users marked as excluded cannot clear estimations!');
    }
  },
  fn: (pushEvent, room, command) => {
    pushEvent('storyEstimateCleared', command.payload);
  }
};

export default clearStoryEstimateCommandHandler;
