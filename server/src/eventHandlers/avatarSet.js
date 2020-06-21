/**
 * user sets his avatar (number)
 */
const avatarSetEventHandler = (room, eventPayload, userId) =>
  room.updateIn(['users', userId], (user) => user.set('avatar', eventPayload.avatar));

export default avatarSetEventHandler;
