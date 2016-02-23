module.exports = function (room, eventPayload) {
  return room.updateIn(['users', eventPayload.userId], user => user.set('disconnected', true));
};
