module.exports = function (room, eventPayload) {
  return room
    .update('stories', stories => stories.map(story => story.removeIn(['estimations', eventPayload.userId])))  // remove leaving user's estimations from all stories
    .removeIn(['users', eventPayload.userId]); // then remove user from room
};
