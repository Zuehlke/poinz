import uuid from '../uuid.js';
import getLogger from '../getLogger.js';
import papa from 'papaparse';

const LOGGER = getLogger('storyImportParser');

const STORY_TITLE_CHAR_LIMIT = 100;
const STORY_DESCRIPTION_CHAR_LIMIT = 2000;

/**
 * parses the given data url (data:text/csv;base64,U3VtbWFyeSxJc3N1ZSBrZXksSXNzdW.......) containing a list of "issues" (e.g. from jira)
 * into Poinz stories
 *
 * @param {string} data
 * @param {string} issueTrackingUrlPattern
 * @return {object[]}
 */
export default function parseCsvDataUrlToStories(data, issueTrackingUrlPattern = '') {
  try {
    LOGGER.debug('Parsing stories...');

    const b64Data = data.substring(data.lastIndexOf(','));
    const plainData = Buffer.from(b64Data, 'base64').toString();

    const results = papa.parse(plainData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.toLowerCase()
    });

    if (
      (results.errors && results.errors.length > 0) ||
      results.meta.aborted ||
      results.meta.truncated
    ) {
      throw new Error('Got errors from parsing or input got truncated...');
    }

    return results.data
      .map(issueObjectToStory.bind(undefined, issueTrackingUrlPattern))
      .filter((story) => !!story);
  } catch (err) {
    throw new Error('Could not parse to stories ' + err);
  }
}

function issueObjectToStory(issueTrackingUrlPattern, issueObject) {
  const title = getTitleFromIssueObject(issueObject);

  if (!title) {
    return undefined;
  }

  return {
    title,
    description: getDescriptionFromIssueObject(issueTrackingUrlPattern, issueObject),
    consensus: getConsensusFromIssueObject(issueObject),
    storyId: uuid(),
    estimations: {},
    createdAt: Date.now()
  };
}

// properties are matched case in-sensitive. define them lowercase here
const KEY_PROPERTY_NAMES = ['issue key', 'issue', 'key'];
const TITLE_PROPERTY_NAMES = ['summary', 'title'];
const DESCR_PROPERTY_NAMES = ['description', 'descr'];
const CONSENSUS_PROPERTY_NAMES = ['points', 'consensus', 'value', 'storypoints', 'estimation'];

function getTitleFromIssueObject(issueObject) {
  let title = '';

  const keyProp = KEY_PROPERTY_NAMES.find(isPropMatch.bind(issueObject));
  if (keyProp) {
    title += issueObject[keyProp] + ' ';
  }
  const titleProp = TITLE_PROPERTY_NAMES.find(isPropMatch.bind(issueObject));
  if (titleProp) {
    title += issueObject[titleProp];
  }

  return title.trim().substring(0, STORY_TITLE_CHAR_LIMIT);
}

function getConsensusFromIssueObject(issueObject) {
  const consensusProp = CONSENSUS_PROPERTY_NAMES.find(isPropMatch.bind(issueObject));
  if (consensusProp) {
    const value = issueObject[consensusProp];
    if (!Number.isFinite(value)) {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? undefined : parsedValue;
    }
  }
}

function getDescriptionFromIssueObject(issueTrackingUrlPattern, issueObject) {
  let description = '';
  const keyProp = KEY_PROPERTY_NAMES.find(isPropMatch.bind(issueObject));
  if (issueTrackingUrlPattern && keyProp) {
    description += issueTrackingUrlPattern.replace(/\{ISSUE}/, issueObject[keyProp]);
    description += '\n\n';
  }

  const descrProp = DESCR_PROPERTY_NAMES.find(isPropMatch.bind(issueObject));
  if (descrProp) {
    description += issueObject[descrProp];
  }

  return description.trim().substring(0, STORY_DESCRIPTION_CHAR_LIMIT);
}

function isPropMatch(propertyName) {
  return !!this[propertyName];
}
