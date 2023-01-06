/**
 * a new story was added to the room
 */
const storyAddedEventHandler = (room, eventPayload) => {
  const newStory = {
    id: eventPayload.storyId,
    title: eventPayload.title,
    estimations: eventPayload.estimations,
    createdAt: eventPayload.createdAt
  };

  if (eventPayload.description) {
    newStory.description = eventPayload.description;
  }
  if (eventPayload.key) {
    newStory.key = eventPayload.key;
  }

  const modifiedStories = [...room.stories, newStory];

  return {
    ...room,
    stories: modifiedStories
  };
};

export default storyAddedEventHandler;
