/**
 * Resets "trashed" flag on matching story.
 * Flag will be "false" afterwards.
 */
const storyRestoredEventHandler = (room, eventPayload) => {
  const modifiedStories = {
    ...room.stories,
    [eventPayload.storyId]: {
      ...room.stories[eventPayload.storyId],
      trashed: false
    }
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyRestoredEventHandler;
