/**
 * Sets "excluded" flag on user to true
 */
import {modifyUser} from './roomModifiers';

const excludedFromEstimationsEventHandler = (room, eventPayload, userId) => {
  return modifyUser(room, userId, (user) => ({
    ...user,
    excluded: true
  }));
};

export default excludedFromEstimationsEventHandler;
