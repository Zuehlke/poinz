/**
 * Stores consensus estimation value (that everybody agreed on) on story.
 */
const consensusAchievedEventHandler = (room, eventPayload) =>
  room.setIn(['stories', eventPayload.storyId, 'consensus'], eventPayload.value);

export default consensusAchievedEventHandler;
