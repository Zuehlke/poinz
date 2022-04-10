/**
 */
const sortOrderSetEventHandler = (room, eventPayload) => {
  const modifiedStories = room.stories.map((roomStory) => {
    const sortOrder = !roomStory.trashed ? eventPayload.sortOrder.indexOf(roomStory.id) : undefined;
    if (!roomStory.trashed && sortOrder < 0) {
      throw new Error('Correct precondition should prevent this!');
    }
    return {
      ...roomStory,
      sortOrder
    };
  });

  modifiedStories.sort((sA, sB) => {
    // if a story has no manual "sortOrder" set, move it to the end of the list
    // a low sortOrder value means "first" / "top" of the list.
    if (isSortOrderDefined(sA) && !isSortOrderDefined(sB)) {
      return -1;
    } else if (!isSortOrderDefined(sA) && isSortOrderDefined(sB)) {
      return 1;
    } else {
      return sA.sortOrder - sB.sortOrder;
    }
  });

  return {...room, stories: modifiedStories};
};
const isSortOrderDefined = (story) => story.sortOrder !== undefined && story.sortOrder !== null;

export default sortOrderSetEventHandler;
