import Immutable from 'immutable';

/**
 * Adds user object with given userId to "users" list on room
 */
const joinedRoomEventHandler = (room, eventPayload) =>
  room.setIn(['users', eventPayload.userId], new Immutable.Map({id: eventPayload.userId}));

export default joinedRoomEventHandler;
