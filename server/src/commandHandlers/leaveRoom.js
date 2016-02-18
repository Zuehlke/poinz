var _ = require('lodash');

module.exports = {
  existingRoom: true,
  preCondition: undefined,
  fn: function addStory(room, command) {
    room.applyEvent('leftRoom', command.payload);

    if (room.attributes.get('moderatorId') === command.payload.userId) {

      var remainingUserIds = _.reject(_.keys(room.attributes.get('users').toJS()), userId => userId === command.payload.userId);

      if (remainingUserIds.length < 1) {
        // last user (moderator) left
        // TODO: maybe mark the room as "orphaned" ?
        // as soon as someone joins a orphaned room, he becomes the moderator
      } else {
        room.applyEvent('moderatorSet', {moderatorId: remainingUserIds[0]});
      }
    }
  }
};
