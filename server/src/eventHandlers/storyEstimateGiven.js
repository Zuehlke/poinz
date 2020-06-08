/**
 * Stores the given estimation value on the story for the given user
 */
const storyEstimateGivenEventHandler = (room, eventPayload) =>
  room.setIn(
    ['stories', eventPayload.storyId, 'estimations', eventPayload.userId],
    eventPayload.value
  );

export default storyEstimateGivenEventHandler;
