/**
 * A user sets his username.
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
            username: {
              type: 'string',
              format: 'username'
            }
          },
          required: ['username'],
          additionalProperties: false
        }
      }
    }
  ]
};

const setUsernameCommandHandler = {
  schema,
  fn: (room, command) => {
    room.applyEvent('usernameSet', command.payload);
  }
};

export default setUsernameCommandHandler;
