/**
 * A user re-orders the backlog manually.
 * This command will set the new sortOrder of all active stories in the room.
 * Trashed stories will not be affected. (sortOrder = undefined).
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
              // list of story-ids. Must contain all ids of all untrashed stories in room.
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid'
              }
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
        `Given sortOrder contains ${sortOrderInCommand.length} storyIds. However, we have ${activeStoriesInRoom.length} (untrashed) stories in our room!`
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
