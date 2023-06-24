import parseCsvDataUrlToStories from './parseCsvDataUrlToStories.js';
import hasActiveStories from './hasActiveStories.js';
import parseJsonDataUrlToStories from './parseJsonDataUrlToStories.js';

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
              format: 'csvOrJsonDataUrl'
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
      let stories;
      // note: the payload.data property is adhering to our custom tv4 format "csvOrJsonDataUrl"
      if (command.payload.data.split('base64,')[0] === 'data:application/json;') {
        stories = parseJsonDataUrlToStories(command.payload.data);
      } else {
        stories = parseCsvDataUrlToStories(command.payload.data, room.issueTrackingUrl);
      }

      if (stories.length < 1) {
        pushImportFailed(pushEvent, room, new Error('No Stories in payload'));
        return;
      }

      stories.forEach((story) => {
        pushEvent('storyAdded', story);

        // do not push "storyEstimateGivenEvents". the userId of all these events here is the user that imports the json or csv file!

        if (story.consensus) {
          pushEvent('consensusAchieved', {
            storyId: story.storyId,
            value: story.consensus,
            settled: true
          });
        }

        if (story.trashed) {
          pushEvent('storyTrashed', {
            storyId: story.storyId
          });
        }
      });

      if (!hasActiveStories(room)) {
        // room has not yet any active (non trashed) stories, therefore let's select the first one
        const untrashedAddedStory = stories.find((story) => !story.trashed);
        if (untrashedAddedStory) {
          pushEvent('storySelected', {storyId: untrashedAddedStory.storyId});
        }
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
