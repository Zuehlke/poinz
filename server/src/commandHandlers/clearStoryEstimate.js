/**
 * A user clears his estimation value for a certain story.
 * Users may only clear estimation for the currently selected story.
 */
import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

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

    throwIfStoryIdNotFoundInRoom(room, command.payload.storyId);

    if (room.stories[command.payload.storyId].revealed) {
      throw new Error('You cannot clear your estimate for a story that was revealed!');
    }

    if (room.users[userId].excluded) {
      throw new Error('Users marked as excluded cannot clear estimations!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyEstimateCleared', command.payload);
  }
};

export default clearStoryEstimateCommandHandler;
