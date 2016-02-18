module.exports = function (room, eventPayload) {
  return room.setIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId], eventPayload.value);
};
