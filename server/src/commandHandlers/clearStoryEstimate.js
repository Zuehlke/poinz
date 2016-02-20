/**
 * A user clears his estimation value for a certain story.
 * Users may only clear estimation for the currently selected story.
 * As soon as all users in the room estimated the current story, this story is "locked" (marked as "allEstimatesGiven").
 * Only the room moderator can then "unlock" the story for a new round
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only clear estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'allEstimatesGiven'])) {
      throw new Error('You cannot clear your estimate for a story with "allEstimatesGiven" set!');
    }
  },
  fn: function clearStoryEstimate(room, command) {
    room.applyEvent('storyEstimateCleared', command.payload);
  }
};
