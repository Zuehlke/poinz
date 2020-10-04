/**
 * Removes matching story from "stories" list in room
 */
const storyDeletedEventHandler = (room, eventPayload) => {
  const modifiedStories = {
    ...room.stories
  };

  delete modifiedStories[eventPayload.storyId];
  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyDeletedEventHandler;
