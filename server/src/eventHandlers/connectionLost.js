module.exports = function (room, eventPayload) {
  const matchingUser = room.getIn(['users', eventPayload.userId]);
  if (matchingUser) {
    return room.updateIn(['users', eventPayload.userId], user => user.set('disconnected', true));
  } else {
    return room;
  }
};
