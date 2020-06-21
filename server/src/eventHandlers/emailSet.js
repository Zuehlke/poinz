/**
 * user set his email address
 */
const emailSetEventHandler = (room, eventPayload, userId) =>
  room.updateIn(['users', userId], (user) => user.set('email', eventPayload.email));

export default emailSetEventHandler;
