/**
 * Sets "excluded" flag on user to true
 */
const excludedFromEstimationsEventHandler = (room, eventPayload) =>
  room.updateIn(['users', eventPayload.userId], (user) => user.set('excluded', true));

export default excludedFromEstimationsEventHandler;
