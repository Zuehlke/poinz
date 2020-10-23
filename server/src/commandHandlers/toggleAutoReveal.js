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

const toggleAutoRevealCommandHandler = {
  schema,
  fn: (room) => {
    if (room.autoReveal) {
      room.applyEvent('autoRevealOff', {});
    } else {
      room.applyEvent('autoRevealOn', {});
    }
  }
};

export default toggleAutoRevealCommandHandler;
