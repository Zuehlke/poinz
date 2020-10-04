/**
 * Marks matching story as "trashed".  Story stays in room.
 */
const storyTrashedEventHandler = (room, eventPayload) => {
  const modifiedStories = {
    ...room.stories,
    [eventPayload.storyId]: {
      ...room.stories[eventPayload.storyId],
      trashed: true
    }
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyTrashedEventHandler;
