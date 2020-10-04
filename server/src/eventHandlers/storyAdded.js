/**
 * a new story was added to the room
 */
const storyAddedEventHandler = (room, eventPayload) => {
  const newStory = {
    ...eventPayload,
    estimations: {}
  };

  const modifiedStories = {
    ...room.stories,
    [eventPayload.id]: newStory
  };

  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyAddedEventHandler;
