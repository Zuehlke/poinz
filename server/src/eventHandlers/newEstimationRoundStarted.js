/**
 * Clears all estimations on story, sets "revealed" flag to false and erases "consensus"
 */
const newEstimationRoundStartedEventHandler = (room, eventPayload) => {
  const modifiedStories = {
    ...room.stories,
    [eventPayload.storyId]: {
      ...room.stories[eventPayload.storyId],
      estimations: {},
      revealed: false,
      consensus: undefined
    }
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default newEstimationRoundStartedEventHandler;
