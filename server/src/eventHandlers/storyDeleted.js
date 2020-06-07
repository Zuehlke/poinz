/**
 * Removes matching story from "stories" list in room
 */
const storyDeletedEventHandler = (room, eventPayload) =>
  room.removeIn(['stories', eventPayload.storyId]);

export default storyDeletedEventHandler;
