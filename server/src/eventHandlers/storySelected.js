module.exports = (room, eventPayload) => room.set('selectedStory', eventPayload.storyId);
