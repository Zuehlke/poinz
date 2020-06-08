/**
 * Store id of given story as "selectedStory"
 */
const storySelectedEventHandler = (room, eventPayload) =>
  room.set('selectedStory', eventPayload.storyId);

export default storySelectedEventHandler;
