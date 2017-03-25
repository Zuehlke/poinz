const visitorSetEventHandler = (room, eventPayload) => (
  room.updateIn(['users', eventPayload.userId], user => user.set('visitor', true))
);

export default visitorSetEventHandler;
