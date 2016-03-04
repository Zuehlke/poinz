module.exports = (room, eventPayload) => room.removeIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId]);
