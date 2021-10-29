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
  fn: (pushEvent, room, command) => {
    const newStoryId = uuid();
    const eventPayload = {
      storyId: newStoryId,
      title: command.payload.title,
      estimations: {},
      createdAt: Date.now()
    };

    if (command.payload.description) {
      eventPayload.description = command.payload.description;
    }

    pushEvent('storyAdded', eventPayload);

    if (!hasActiveStories(room)) {
      // this is the first story that gets added (or all other stories are "trashed")
      pushEvent('storySelected', {storyId: newStoryId});
    }
  }
};

export default addStoryCommandHandler;
