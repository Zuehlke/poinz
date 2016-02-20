var uuid = require('node-uuid').v4;

/**
 * A user adds a story to the estimation backlog of the room
 */
module.exports = {
  existingRoom: true,
  preCondition: undefined,
  fn: function addStory(room, command) {
    room.applyEvent('storyAdded', Object.assign({id: uuid()}, command.payload));
  }
};
