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

    if (activeStoriesInRoom.length !== command.payload.sortOrder.length) {
      throw new Error(
        `Given sortOrder contains ${command.payload.sortOrder.length} storyIds. However, we have ${activeStoriesInRoom.length} stories in our room!`
      );
    }

    const allIdsInCommandPresentInRoom = command.payload.sortOrder.every(
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
