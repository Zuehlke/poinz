const uuid = require('node-uuid').v4;

/**
 * A user adds a story to the estimation backlog of the room
 */
module.exports = {
  existingRoom: true,
  preCondition: (room, command, userId) => {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot add stories!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyAdded', Object.assign({
      id: uuid(),
      estimations: {}
    }, command.payload));
  }
};
