module.exports = function (room, eventPayload) {
  return room.removeIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId]);
};
