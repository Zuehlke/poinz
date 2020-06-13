/**
 * Stores the given estimation value on the story for the given user
 */
const storyEstimateGivenEventHandler = (room, eventPayload, userId) =>
  room.setIn(['stories', eventPayload.storyId, 'estimations', userId], eventPayload.value);

export default storyEstimateGivenEventHandler;
