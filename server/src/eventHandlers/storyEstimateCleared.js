/**
 * Removes a previously set estimation value on the given story for the given user
 */
const storyEstimateClearedEventHandler = (room, eventPayload) =>
  room.removeIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId]);

export default storyEstimateClearedEventHandler;
