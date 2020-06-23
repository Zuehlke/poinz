/**
 * Resets "trashed" flag on matching story.
 * Flag will be "false" afterwards.
 */
const storyRestoredEventHandler = (room, eventPayload) =>
  room.setIn(['stories', eventPayload.storyId, 'trashed'], false);

export default storyRestoredEventHandler;
