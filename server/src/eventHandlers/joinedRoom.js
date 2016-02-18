var Immutable = require('immutable');

module.exports = function joinedRoom(room, eventPayload) {
  return room.setIn(['users', eventPayload.userId], new Immutable.Map({id: eventPayload.userId}));
};
