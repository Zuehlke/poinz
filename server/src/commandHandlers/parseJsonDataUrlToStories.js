import getLogger from '../getLogger.js';
import uuid from '../uuid.js';

const LOGGER = getLogger('storyImportParserJson');

/**
 * parses the given data url (data:application/json;base64,U3VtbWFyeSxJc3N1ZSBrZXksSXNzdW.......) containing a list of poinz stories
 * into Poinz stories
 *
 * @param {string} data
 * @return {object[]}
 */
export default function parseJsonDataUrlToStories(data) {
  try {
    LOGGER.debug('Parsing stories...');

    const b64Data = data.substring(data.lastIndexOf(','));
    const plainData = Buffer.from(b64Data, 'base64').toString();

    const parsedRoomObject = JSON.parse(plainData);

    if (
      parsedRoomObject.stories &&
      Array.isArray(parsedRoomObject.stories) &&
      parsedRoomObject.stories.length > 0
    ) {
      return parsedRoomObject.stories.map(mapToSanitizedStoryObject);
    } else {
      return [];
    }
  } catch (err) {
    throw new Error('Could not parse to stories ' + err);
  }
}

function mapToSanitizedStoryObject(storyFromImportFile) {
  const mappedStory = {
    title: storyFromImportFile.title,
    description: storyFromImportFile.description,
    estimations: {}, // we decided to not include estimations in the import. would lead to inconsistencies, because when importing, we replay events. "storyEstimateGiven" events would have the wrong user Id
    storyId: uuid(), // we assign a new storyId
    createdAt: Date.now() // and give it the current date as createdAt
  };

  if (storyFromImportFile.trashed) {
    mappedStory.trashed = true;
  }

  if (storyFromImportFile.consensus) {
    mappedStory.consensus = storyFromImportFile.consensus;
  }

  return mappedStory;
}
