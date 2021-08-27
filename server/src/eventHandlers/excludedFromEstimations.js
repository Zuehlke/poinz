/**
 * Sets "excluded" flag on user to true
 */
import {modifyUser} from './roomModifiers';

const excludedFromEstimationsEventHandler = (room, eventPayload) => {
  return modifyUser(room, eventPayload.userId, (user) => ({
    ...user,
    excluded: true
  }));
};

export default excludedFromEstimationsEventHandler;
