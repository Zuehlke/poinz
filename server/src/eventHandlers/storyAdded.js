const Immutable = require('immutable');

module.exports = (room, eventPayload) => {

  const newStory = Immutable.fromJS(Object.assign(eventPayload, {
    estimations: {}
  }));

  return room.update('stories', new Immutable.Map(), stories => stories.set(eventPayload.id, newStory));
};
