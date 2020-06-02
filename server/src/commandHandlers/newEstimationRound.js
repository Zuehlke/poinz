/**
 * A user starts a new estimation round for a certain story.
 * This will clear all estimations given by users for this story.
 * This will reset any consensus that might have been achieved previously.
 *
 * Can only be done for the currently selected story.
 */
const newEstimationRoundCommandHandler = {
  preCondition: (room, command) => {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only start a new round for currently selected story!');
    }
  },
  fn: (room, command) => {
    room.applyEvent('newEstimationRoundStarted', command.payload);
  }
};

export default newEstimationRoundCommandHandler;
