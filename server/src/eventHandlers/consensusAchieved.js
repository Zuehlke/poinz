/**
 * Stores consensus estimation value (that everybody agreed on) on story.
 */
const consensusAchievedEventHandler = (room, eventPayload) => {
  const modifiedStories = {
    ...room.stories,
    [eventPayload.storyId]: {
      ...room.stories[eventPayload.storyId],
      consensus: eventPayload.value
    }
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default consensusAchievedEventHandler;
