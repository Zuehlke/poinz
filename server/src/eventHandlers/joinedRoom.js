import Immutable from 'immutable';

const joinedRoomEventHandler = (room, eventPayload) => (
  room.setIn(['users', eventPayload.userId], new Immutable.Map({id: eventPayload.userId}))
);

export default joinedRoomEventHandler;
