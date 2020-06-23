/**
 * Marks matching story as "trashed".  Story stays in room.
 */
const storyTrashedEventHandler = (room, eventPayload) =>
  room.setIn(['stories', eventPayload.storyId, 'trashed'], true);

export default storyTrashedEventHandler;
