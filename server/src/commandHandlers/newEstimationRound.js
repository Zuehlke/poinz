module.exports = {
  existingRoom: true,
  preCondition: function (room, command) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only start a new round for currently selected story!');
    }
  },
  fn: function newEstimationRound(room, command) {
    room.applyEvent('newEstimationRoundStarted', command.payload);
  }
};
