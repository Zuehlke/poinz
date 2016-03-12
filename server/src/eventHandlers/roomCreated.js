const Immutable = require('immutable');

// here we create the room object
module.exports = (room, eventPayload) => (
  Immutable.fromJS({
    id: eventPayload.id,
    users: {},
    stories: {},
    created: new Date().getTime()
  })
);
