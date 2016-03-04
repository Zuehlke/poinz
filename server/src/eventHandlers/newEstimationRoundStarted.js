const Immutable = require('immutable');

module.exports = (room, eventPayload) => (
  room
    .setIn(['stories', eventPayload.storyId, 'estimations'], new Immutable.Map())
    .setIn(['stories', eventPayload.storyId, 'revealed'], false)
);
