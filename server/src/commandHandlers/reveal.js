/**
 * A user manually reveals estimates for a certain story
 * Users may only reveal the currently selected story
 * A user that is marked as visitor cannot reveal stories
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only reveal currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'revealed'])) {
      throw new Error('Story was already revealed!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot reveal stories!');
    }
  },
  fn: function giveStoryEstimate(room, command) {
    room.applyEvent('revealed', {
      storyId: command.payload.storyId,
      manually: true
    });
  }
};
