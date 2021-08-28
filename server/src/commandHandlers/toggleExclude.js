import {getMatchingUserOrThrow} from './commonPreconditions';

/**
 *
 * Marks a user as "Spectator" (excluded from estimations)
 * If user is marked as excluded, he cannot estimate stories.
 * As of #200, every user can "exclude" every other user -> we pass the userId in the payload of the command
 *
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
            userId: {
              type: 'string',
              format: 'uuidv4'
            }
          },
          required: ['userId'],
          additionalProperties: false
        }
      }
    }
  ]
};

const toggleExcludeCommandHandler = {
  schema,
  fn: (room, command) => {
    const matchingUser = getMatchingUserOrThrow(room, command.payload.userId);
    if (matchingUser.excluded) {
      room.applyEvent('includedInEstimations', {userId: command.payload.userId});
    } else {
      room.applyEvent('excludedFromEstimations', {userId: command.payload.userId});
    }
  }
};

export default toggleExcludeCommandHandler;
