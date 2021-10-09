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
  fn: (pushEvent, room) => {
    if (room.autoReveal) {
      pushEvent('autoRevealOff', {});
    } else {
      pushEvent('autoRevealOn', {});
    }
  }
};

export default toggleAutoRevealCommandHandler;
