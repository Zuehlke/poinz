var Immutable = require('immutable');

module.exports = function (room, eventPayload) {
  return room
    .setIn(['stories', eventPayload.storyId, 'estimations'], new Immutable.Map())
    .setIn(['stories', eventPayload.storyId, 'revealed'], false);
};
