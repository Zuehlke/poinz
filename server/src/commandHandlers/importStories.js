import parseCsvDataUrlToStories from './parseCsvDataUrlToStories';

/**
 * A user wants to import multiple stories.
 * payload.data is expected to be a base64 encoded "data url" (something like   data:text/csv;base64,U3VtbWFyeSxJc3N1ZSBrZXksSXNzdW.......   )
 *
 * Will trigger "storyAdded" events for all successfully parsed stories
 * Will trigger "storySelected" event, if no story is selected
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
            data: {
              type: 'string',
              format: 'csvDataUrl'
            }
          },
          required: ['data'],
          additionalProperties: false
        }
      }
    }
  ]
};

const importStoriesCommandHandler = {
  schema,
  fn: (room, command) => {
    try {
      const stories = parseCsvDataUrlToStories(command.payload.data);

      if (stories.length < 1) {
        applyFailed(room, new Error('No Stories in payload'));
        return;
      }

      stories.forEach((story) => {
        room.applyEvent('storyAdded', story);
      });

      if (
        !room.get('stories') ||
        !room
          .get('stories')
          .filter((s) => !s.get('trashed'))
          .first()
      ) {
        // this is the first story that gets added (or all other stories are "trashed")
        room.applyEvent('storySelected', {storyId: stories[0].id});
      }
    } catch (err) {
      applyFailed(room, err);
    }
  }
};

export default importStoriesCommandHandler;

function applyFailed(room, err) {
  room.applyEvent('importFailed', {message: err.message});
}
