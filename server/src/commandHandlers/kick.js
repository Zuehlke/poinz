/**
 * A user removes a disconnected user from the room.
 *
 */
import {throwIfUserIdNotFoundInRoom} from './commonPreconditions';

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

const kickCommandHandler = {
  schema,
  preCondition: (room, command, userId) => {
    if (userId === command.payload.userId) {
      throw new Error('User cannot kick himself!');
    }

    throwIfUserIdNotFoundInRoom(room, command.payload.userId);
  },
  fn: (room, command) => {
    room.applyEvent('kicked', {userId: command.payload.userId});
  }
};

export default kickCommandHandler;
