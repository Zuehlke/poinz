/**
 * A user changes the title and/or description of a story
 */
const changeStoryCommandHandler = {
  existingRoom: true,
  preCondition: (room, command, userId) => {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot change stories!');
    }

    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot change unknown story ' + command.payload.storyId);
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyChanged', command.payload);
  }
};

export default changeStoryCommandHandler;
