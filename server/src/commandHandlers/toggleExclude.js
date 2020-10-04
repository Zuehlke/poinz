/**
 * Emits event "excludedFromEstimations" or "includedInEstimations"  on toggle
 *
 * (If user is marked as excluded, he cannot estimate stories.)
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
    if (room.users[userId].excluded) {
      room.applyEvent('includedInEstimations', {});
    } else {
      room.applyEvent('excludedFromEstimations', {});
    }
  }
};

export default toggleExcludeCommandHandler;
