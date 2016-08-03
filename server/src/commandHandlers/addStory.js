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

    const newStoryId = uuid();

    const eventPayload = command.payload;
    eventPayload.id = newStoryId;
    eventPayload.estimations = {};
    eventPayload.createdAt = new Date().getTime();
    room.applyEvent('storyAdded', eventPayload);

    if (!room.get('stories') || !room.get('stories').first()) {
      // this is the first story that gets added
      room.applyEvent('storySelected', {storyId: newStoryId});
    }
  }
};
