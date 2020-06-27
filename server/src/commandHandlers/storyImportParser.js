import {v4 as uuid} from 'uuid';
import {parse as parseCsv} from 'papaparse';
import getLogger from '../getLogger';

const LOGGER = getLogger('storyImportParser');

export default function parseToStories(data) {
  try {
    LOGGER.debug('Parsing stories...');

    const b64Data = data.substring(data.lastIndexOf(','));
    const plainData = Buffer.from(b64Data, 'base64').toString();

    const results = parseCsv(plainData, {header: true, skipEmptyLines: true});

    if (
      (results.errors && results.errors.length > 0) ||
      results.meta.aborted ||
      results.meta.truncated
    ) {
      throw new Error('Got errors from parsing or input got truncated...');
    }

    return results.data.map(jiraIssueObjectToStory);
  } catch (err) {
    throw new Error('Could not parse to stories ' + err);
  }
}

function jiraIssueObjectToStory(jiraIssueObject) {
  return {
    title: getTitleFromJiraIssueObject(jiraIssueObject),
    description: getDescriptionFromJiraIssueObject(jiraIssueObject),
    id: uuid(),
    estimations: {},
    createdAt: Date.now()
  };
}

function getTitleFromJiraIssueObject(jiraIssueObject) {
  let title = '';
  if (jiraIssueObject['Issue key']) {
    title += jiraIssueObject['Issue key'] + ' ';
  }

  if (jiraIssueObject.Summary) {
    title += jiraIssueObject.Summary;
  }

  return title;
}

function getDescriptionFromJiraIssueObject(jiraIssueObject) {
  let description = '';
  if (jiraIssueObject.Description) {
    description += jiraIssueObject.Description;
  }
  return description;
}
