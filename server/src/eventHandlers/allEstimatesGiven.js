module.exports = function (room, eventPayload) {
  return room.setIn(['stories', eventPayload.storyId, 'allEstimatesGiven'], true);
};
