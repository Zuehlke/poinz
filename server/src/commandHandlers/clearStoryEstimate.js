/**
 * A user clears his estimation value for a certain story.
 * Users may only clear estimation for the currently selected story.
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only clear estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      throw new Error('You cannot clear your estimate for a story that was revealed!');
    }
  },
  fn: function clearStoryEstimate(room, command) {
    room.applyEvent('storyEstimateCleared', command.payload);
  }
};
