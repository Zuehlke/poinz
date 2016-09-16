/**
 * A user clears his estimation value for a certain story.
 * Users may only clear estimation for the currently selected story.
 */
const clearStoryEstimateCommandHandler = {
  existingRoom: true,
  preCondition: (room, command, userId) => {
    if (command.payload.userId !== userId) {
      throw new Error('Can only clear estimate if userId in command payload matches!');
    }

    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only clear estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      throw new Error('You cannot clear your estimate for a story that was revealed!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot clear estimations!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('storyEstimateCleared', command.payload);
  }
};

export default clearStoryEstimateCommandHandler;
