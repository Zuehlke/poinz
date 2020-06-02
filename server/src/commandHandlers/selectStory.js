/**
 * A user selected a story (marked it as the "current" story to estimate)
 */
const selectStoryCommandHandler = {
  preCondition: (room, command) => {
    // check that id in payload is one of the stories in room
    if (!room.getIn(['stories', command.payload.storyId])) {
      throw new Error(
        `Story ${command.payload.storyId} cannot be selected. It is not part of room ${room.get(
          'id'
        )}`
      );
    }
  },
  fn: (room, command) => {
    room.applyEvent('storySelected', {storyId: command.payload.storyId});
  }
};

export default selectStoryCommandHandler;
