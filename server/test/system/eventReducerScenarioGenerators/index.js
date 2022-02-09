import path from 'path';
import {promises as fs, constants as fsConst} from 'fs';

const clientEventActionReducerScenarioDir = path.resolve(
  __dirname,
  '../../../../client/test/integration/eventActionReducersScenarios/events'
);

/**
 *  These tests create real-live lists of events by firing commands to the backend. (not really a test, no assertions here)
 *  These "scenarios" are used for frontend reducer unit tests (redux). We ensure that the frontend reducer tests use valid backend events!
 *
 *  This needs a running Poinz backend on localhost:3000
 *
 *  This writes json files to the client directory (if there are changes in the produced events apart from the ever-changing uids (uuidv4 or nanoid))
 *
 *  See /docu/technicalDocu.md for further information
 */

/**
 *
 * @param {object[]} events
 * @param {string} outputFilename
 */
export async function dumpEventsToFile(events, outputFilename) {
  const outputFullPath = path.resolve(clientEventActionReducerScenarioDir, outputFilename);
  const outputFileExists = await fileExists(outputFullPath);

  if (!outputFileExists) {
    await dumpEventsFile(outputFullPath, events, true);
  } else {
    // usually, the output json already exists (for existing tests, since output files are committed to the repository)
    // in this case, dont write the new list of event to a file every time.
    // perform a comparison between the old and the new list of events while ignoring all "dynamic" properties like uuids &  timestamps
    const previousEvents = await readJsonFile(outputFullPath);
    const serializedWithResettedIdsPrevious = JSON.stringify(
      resetIdAndTokenProperties(previousEvents),
      null,
      4
    );
    const serializedWithResettedIdsNext = JSON.stringify(
      resetIdAndTokenProperties(events),
      null,
      4
    );
    if (serializedWithResettedIdsPrevious !== serializedWithResettedIdsNext) {
      await dumpEventsFile(outputFullPath, events, true);

      // for debugging purposes, if you wonder why the event files get written:
      await fs.writeFile(outputFullPath + '_PREV', serializedWithResettedIdsPrevious, 'utf-8');
      await fs.writeFile(outputFullPath + '_NEW', serializedWithResettedIdsNext, 'utf-8');
    }
  }
}

async function dumpEventsFile(path, events, compact = false) {
  await fs.writeFile(path, JSON.stringify(events, null, compact ? 0 : 4), 'utf-8');
}

const PROPERTY_NAMES_TO_RESET = [
  'id',
  'roomId',
  'correlationId',
  'userId',
  'selectedStory',
  'storyId',
  'token',
  'createdAt'
];

/**
 * recursively traverses given js obj. sets "*id", "selectedStory" and "token" properties to "-1".
 * @param {*} obj
 * @return {string|{}|*}
 */
function resetIdAndTokenProperties(obj) {
  if (!obj) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(resetIdAndTokenProperties);
  } else if (typeof obj === 'string') {
    return obj;
  } else if (typeof obj === 'object') {
    return Object.keys(obj).reduce((newObj, k) => {
      if (PROPERTY_NAMES_TO_RESET.includes(k) && typeof obj[k] === 'string') {
        newObj[k] = '[ID]';
      } else if (PROPERTY_NAMES_TO_RESET.includes(k) && typeof obj[k] === 'number') {
        newObj[k] = '[NUMBER]';
      } else if (k === 'estimations' || k === 'estimationsConfidence') {
        newObj[k] = resetAllPropertyNames(obj[k]);
      } else {
        newObj[k] = resetIdAndTokenProperties(obj[k]);
      }
      return newObj;
    }, {});
  } else {
    return obj; // for everything else that is truthy (boolean true, numbers)
  }
}

function resetAllPropertyNames(obj) {
  return Object.keys(obj).reduce((newObj, k, index) => {
    newObj[`p${index}`] = obj[k];
    return newObj;
  }, {});
}

async function fileExists(fullFilePath) {
  try {
    await fs.access(fullFilePath, fsConst.F_OK);
    return true;
  } catch (accessError) {
    return false;
  }
}

async function readJsonFile(fullFilePath) {
  const existingFileContent = await fs.readFile(fullFilePath, 'utf-8');
  return JSON.parse(existingFileContent);
}
