import {modifyUser} from './roomModifiers.js';

/**
 * user sets his avatar (number)
 */
const avatarSetEventHandler = (room, eventPayload, userId) => {
  return modifyUser(room, userId, (user) => ({
    ...user,
    avatar: eventPayload.avatar
  }));
};

export default avatarSetEventHandler;
