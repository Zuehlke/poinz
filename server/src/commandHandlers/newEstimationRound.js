/**
 * The moderator starts a new estimation round for a certain story.
 * (this will clear all estimations given by users for this story).
 *
 * Can only be done for the currently selected story.
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    // only moderator can start a new round
    if (room.get('moderatorId') !== userId) {
      throw new Error('Only the moderator of room ' + room.get('id') + ' can start a new estimation round.');
    }

    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only start a new round for currently selected story!');
    }
  },
  fn: function newEstimationRound(room, command) {
    room.applyEvent('newEstimationRoundStarted', command.payload);
  }
};
