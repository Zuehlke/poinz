import Immutable from 'immutable';

/**
 * Adds user object with given userId to "users" list on room
 */
const joinedRoomEventHandler = (room, eventPayload, userId) =>
  room.setIn(['users', userId], new Immutable.Map({id: userId}));

export default joinedRoomEventHandler;
