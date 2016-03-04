module.exports = (room, eventPayload) => room.setIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId], eventPayload.value);
