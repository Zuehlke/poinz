const Immutable = require('immutable');

module.exports = (room, eventPayload) => room.setIn(['users', eventPayload.userId], new Immutable.Map({id: eventPayload.userId}));
