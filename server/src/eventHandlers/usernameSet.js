const usernameSetEventHandler = (room, eventPayload, userId) =>
  room.updateIn(['users', userId], (user) => user.set('username', eventPayload.username));

export default usernameSetEventHandler;
