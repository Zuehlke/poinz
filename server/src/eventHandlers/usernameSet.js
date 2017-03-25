const usernameSetEventHandler = (room, eventPayload) => (
  room.updateIn(['users', eventPayload.userId], user => user.set('username', eventPayload.username))
);

export default usernameSetEventHandler;
