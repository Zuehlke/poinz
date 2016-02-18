module.exports = function moderatorSet(room, eventPayload) {
  return room.set('moderatorId', eventPayload.moderatorId);
};
