/**
 */
const sortOrderSetEventHandler = (room, eventPayload) => {
  const modifiedStories = room.stories.map((roomStory) => {
    const sortOrder = !roomStory.trashed ? eventPayload.sortOrder.indexOf(roomStory.id) : undefined;
    return {
      ...roomStory,
      sortOrder
    };
  });
  return {...room, stories: modifiedStories};
};

export default sortOrderSetEventHandler;
