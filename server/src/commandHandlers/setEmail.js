/**
 * A user sets his email address (used for Gravatar image fetching. See https://en.gravatar.com/ ).
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
            email: {
              type: 'string',
              format: 'email'
            }
          },
          comment:
            'do not set email as required. if not set or empty string (or falsy value) will reset email',
          required: [],
          additionalProperties: false
        }
      }
    }
  ]
};

const setEmailCommandHandler = {
  schema,
  fn: (room, command) => {
    room.applyEvent('emailSet', command.payload);
  }
};

export default setEmailCommandHandler;
