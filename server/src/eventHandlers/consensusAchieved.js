const consensusAchievedEventHandler = (room, eventPayload) =>
  room.setIn(['stories', eventPayload.storyId, 'consensus'], eventPayload.value);

export default consensusAchievedEventHandler;
