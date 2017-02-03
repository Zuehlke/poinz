/**
 * A user deletes a story
 */
const deleteStoryCommandHandler = {
  existingRoom: true,
  preCondition: (room, command, userId) => {
    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot delete stories!');
    }

    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot delete unknown story ' + command.payload.storyId);
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyDeleted', command.payload);
  }
};

export default deleteStoryCommandHandler;
