import {modifyUser} from './roomModifiers';

/**
 * Sets "excluded" flag on user to false
 */
const includedInEstimationsEventHandler = (room, eventPayload, userId) => {
  return modifyUser(room, userId, (user) => ({
    ...user,
    excluded: false
  }));
};

export default includedInEstimationsEventHandler;
