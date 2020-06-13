/**
 * Sets "excluded" flag on user to true
 */
const excludedFromEstimationsEventHandler = (room, eventPayload, userId) =>
  room.updateIn(['users', userId], (user) => user.set('excluded', true));

export default excludedFromEstimationsEventHandler;
