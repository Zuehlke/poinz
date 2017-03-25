const emailSetEventHandler = (room, eventPayload) => (
  room.updateIn(['users', eventPayload.userId], user => user.set('email', eventPayload.email))
);

export default emailSetEventHandler;
