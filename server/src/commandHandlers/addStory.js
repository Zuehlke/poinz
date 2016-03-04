const uuid = require('node-uuid').v4;

/**
 * A user adds a story to the estimation backlog of the room
 */
module.exports = {
  existingRoom: true,
  fn: (room, command) => {
    room.applyEvent('storyAdded', Object.assign({
      id: uuid(),
      estimations: {}
    }, command.payload));
  }
};
