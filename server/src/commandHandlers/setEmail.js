import {createHash} from 'crypto';

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
  fn: (pushEvent, room, command) => {
    pushEvent('emailSet', {
      ...command.payload,
      emailHash: calcEmailHash(command.payload.email)
    });
  }
};

export default setEmailCommandHandler;

export function calcEmailHash(email) {
  return createHash('md5').update(email).digest('hex');
}
