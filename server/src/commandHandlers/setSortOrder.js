/**
 * A user re-orders the backlog manually.
 *
 */
const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {
            sortOrder: {
              type: 'array'
            }
          },
          required: ['sortOrder'],
          additionalProperties: false
        }
      }
    }
  ]
};

const setSortOrderCommandHandler = {
  schema,
  preCondition: (room, command) => {
    const activeStoriesInRoom = room.stories.filter((s) => !s.trashed);
    const sortOrderInCommand = [...new Set(command.payload.sortOrder)]; // remove any duplicates

    if (activeStoriesInRoom.length !== sortOrderInCommand.length) {
      throw new Error(
        `Given sortOrder contains ${sortOrderInCommand.length} storyIds. However, we have ${activeStoriesInRoom.length} stories in our room!`
      );
    }

    const allIdsInCommandPresentInRoom = sortOrderInCommand.every(
      (storyId) => !!activeStoriesInRoom.find((s) => s.id === storyId)
    );

    if (!allIdsInCommandPresentInRoom) {
      throw new Error('Given sortOrder contains storyIds that do not match stories in our room!');
    }
  },
  fn: (pushEvent, room, command) => {
    pushEvent('sortOrderSet', command.payload);
  }
};

export default setSortOrderCommandHandler;
