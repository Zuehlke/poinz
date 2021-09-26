/**
 * A user toggles the "autoReveal" flag on the room
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

const toggleConfidenceCommandHandler = {
  schema,
  fn: (room) => {
    if (room.withConfidence) {
      room.applyEvent('confidenceOff', {});
    } else {
      room.applyEvent('confidenceOn', {});
    }
  }
};

export default toggleConfidenceCommandHandler;
