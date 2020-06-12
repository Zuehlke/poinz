/**
 * Removes a previously set estimation value on the given story for the given user
 */
const storyEstimateClearedEventHandler = (room, eventPayload, userId) =>
  room.removeIn(['stories', eventPayload.storyId, 'estimations', userId]);

export default storyEstimateClearedEventHandler;
