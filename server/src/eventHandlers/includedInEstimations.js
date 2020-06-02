const includedInEstimationsEventHandler = (room, eventPayload) =>
  room.updateIn(['users', eventPayload.userId], (user) => user.set('excluded', false));

export default includedInEstimationsEventHandler;
