module.exports = function (room, eventPayload) {
  return room.set('selectedStory', eventPayload.storyId);
};
