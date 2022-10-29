import {modifyUser} from './roomModifiers.js';

/**
 * user set his email address
 */
const emailSetEventHandler = (room, eventPayload, userId) => {
  return modifyUser(room, userId, (user) => ({
    ...user,
    email: eventPayload.email,
    emailHash: eventPayload.emailHash
  }));
};

export default emailSetEventHandler;
