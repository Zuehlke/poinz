import {modifyUser} from './roomModifiers';

/**
 * Sets "excluded" flag on user to true.
 * (user is now a "spectator")
 */
const excludedFromEstimationsEventHandler = (room, eventPayload) => {
  return modifyUser(room, eventPayload.userId, (user) => ({
    ...user,
    excluded: true
  }));
};

export default excludedFromEstimationsEventHandler;
