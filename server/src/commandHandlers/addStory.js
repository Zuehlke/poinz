var uuid = require('node-uuid').v4;

module.exports = {
  existingRoom: true,
  preCondition: undefined,
  fn: function addStory(room, command) {
    room.applyEvent('storyAdded', Object.assign({id: uuid()}, command.payload));
  }
};
