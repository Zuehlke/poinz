/**
 * Stores the given estimation value on the story for the given user
 */
const storyEstimateGivenEventHandler = (room, eventPayload, userId) => {
  const modifiedStories = {
    ...room.stories,
    [eventPayload.storyId]: {
      ...room.stories[eventPayload.storyId],
      estimations: {
        ...room.stories[eventPayload.storyId].estimations,
        [userId]: eventPayload.value
      }
    }
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyEstimateGivenEventHandler;
