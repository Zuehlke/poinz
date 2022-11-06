/**
 * A user did re-order the backlog manually.
 * This did set the new sortOrder on all active stories in the room.
 * Trashed stories will not be affected. (sortOrder = undefined).
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
