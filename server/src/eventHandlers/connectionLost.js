import {modifyUser} from './roomModifiers.js';

/**
 * Marks user as "disconnected".
 */
const connectionLostEventHandler = (room, eventPayload, userId) => {
  return modifyUser(room, userId, (user) => ({
    ...user,
    disconnected: true
  }));
};

export default connectionLostEventHandler;
