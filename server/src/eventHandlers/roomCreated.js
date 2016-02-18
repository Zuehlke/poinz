var Immutable = require('immutable');

module.exports = function roomCreated(room, eventPayload) {
  // here we create the room object
  return Immutable.fromJS({
    id: eventPayload.id,
    users: {},
    stories: {}
  });
};
