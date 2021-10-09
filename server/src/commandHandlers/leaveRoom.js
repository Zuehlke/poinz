/**
 * A user wants to leave the room.
 * Is also produced by the socketServer itself on connection lost!
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
            connectionLost: {
              type: 'boolean'
            }
          },
          required: [],
          additionalProperties: false
        }
      }
    }
  ]
};

const leaveRoomCommandHandler = {
  schema,
  fn: (pushEvent, room, command) => {
    if (command.payload.connectionLost) {
      pushEvent('connectionLost', {});
    } else {
      pushEvent('leftRoom', {});
    }
  }
};

export default leaveRoomCommandHandler;
