/**
 * A user removes a disconnected user from the room.
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

const kickCommandHandler = {
  schema,
  preCondition: (room, command, userId) => {
    if (userId === command.payload.userId) {
      throw new Error('User cannot kick himself!');
    }

    if (!room.getIn(['users', command.payload.userId])) {
      throw new Error('Can only kick user that belongs to the same room!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('kicked', {userId: command.payload.userId});
  }
};

export default kickCommandHandler;
