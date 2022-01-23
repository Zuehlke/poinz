import parseCsvDataUrlToStories from './parseCsvDataUrlToStories';
import hasActiveStories from './hasActiveStories';

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
  fn: (pushEvent, room, command) => {
    try {
      const stories = parseCsvDataUrlToStories(command.payload.data, room.issueTrackingUrl);

      if (stories.length < 1) {
        pushImportFailed(pushEvent, room, new Error('No Stories in payload'));
        return;
      }

      stories.forEach((story) => {
        pushEvent('storyAdded', story);
      });

      if (!hasActiveStories(room)) {
        // this is the first story that gets added (or all other stories are marked "trashed")
        pushEvent('storySelected', {storyId: stories[0].storyId});
      }
    } catch (err) {
      pushImportFailed(pushEvent, room, err);
    }
  }
};

export default importStoriesCommandHandler;

function pushImportFailed(pushEvent, room, err) {
  pushEvent('importFailed', {message: err.message});
}
