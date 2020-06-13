/**
 * Sets "excluded" flag on user to false
 */
const includedInEstimationsEventHandler = (room, eventPayload, userId) =>
  room.updateIn(['users', userId], (user) => user.set('excluded', false));

export default includedInEstimationsEventHandler;
