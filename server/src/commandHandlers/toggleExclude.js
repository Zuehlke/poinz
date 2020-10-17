/**
 * Emits event "excludedFromEstimations" or "includedInEstimations"  on toggle
 *
 * (If user is marked as excluded, he cannot estimate stories.)
 *
 */
import {getMatchingUserOrThrow} from './commonPreconditions';

const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {},
          required: [],
          additionalProperties: false
        }
      }
    }
  ]
};

const toggleExcludeCommandHandler = {
  schema,
  fn: (room, command, userId) => {
    const matchingUser = getMatchingUserOrThrow(room, userId);
    if (matchingUser.excluded) {
      room.applyEvent('includedInEstimations', {});
    } else {
      room.applyEvent('excludedFromEstimations', {});
    }
  }
};

export default toggleExcludeCommandHandler;
