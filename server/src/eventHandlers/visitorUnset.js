const visitorUnsetEventHandler = (room, eventPayload) => (
  room.updateIn(['users', eventPayload.userId], user => user.set('visitor', false))
);

export default visitorUnsetEventHandler;
