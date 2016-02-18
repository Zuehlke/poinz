var Immutable = require('immutable');

module.exports = function (room, eventPayload) {

  var newStory = Immutable.fromJS(Object.assign(eventPayload, {
    estimations: {}
  }));

  return room.update('stories', new Immutable.Map(), stories => stories.set(eventPayload.id, newStory));
};
