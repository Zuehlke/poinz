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
  fn: (pushEvent, room) => {
    if (room.withConfidence) {
      pushEvent('confidenceOff', {});
    } else {
      pushEvent('confidenceOn', {});
    }
  }
};

export default toggleConfidenceCommandHandler;
