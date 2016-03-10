
/**
 * A user changes the title and/or description of a story
 */
module.exports = {
  existingRoom: true,
  preCondition: (room, command) => {
    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot change unknown story ' + command.payload.storyId);
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyChanged', command.payload);
  }
};
