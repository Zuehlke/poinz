import {v4 as uuid} from 'uuid';
import hasActiveStories from './hasActiveStories';

/**
 * A user adds a story to the estimation backlog of the room
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
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 100
            },
            description: {
              type: 'string',
              minLength: 0,
              maxLength: 2000
            }
          },
          required: ['title'],
          additionalProperties: false
        }
      }
    }
  ]
};

const addStoryCommandHandler = {
  schema,
  fn: (room, command) => {
    const newStoryId = uuid();

    room.applyEvent('storyAdded', {
      ...command.payload,
      id: newStoryId,
      estimations: {},
      createdAt: Date.now()
    });

    if (!hasActiveStories(room)) {
      // this is the first story that gets added (or all other stories are "trashed")
      room.applyEvent('storySelected', {storyId: newStoryId});
    }
  }
};

export default addStoryCommandHandler;
