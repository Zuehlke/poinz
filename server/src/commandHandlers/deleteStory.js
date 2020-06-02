/**
 * A user deletes a story
 */
const deleteStoryCommandHandler = {
  preCondition: (room, command) => {
    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error('Cannot delete unknown story ' + command.payload.storyId);
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyDeleted', command.payload);
  }
};

export default deleteStoryCommandHandler;
