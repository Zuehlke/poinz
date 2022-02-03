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
    await fs.writeFile(outputFullPath, JSON.stringify(events), 'utf-8');
  } else {
    // usually, the output json already exists (for existing tests, since output files are committed to the repository)
    // in this case, perform a "uuid-ignoring" diff
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
      await fs.writeFile(outputFullPath, JSON.stringify(events), 'utf-8');

      // for debugging purposes, if you wonder why the event files get written:
      await fs.writeFile(outputFullPath + '_PREV', serializedWithResettedIdsPrevious, 'utf-8');
      await fs.writeFile(outputFullPath + '_NEW', serializedWithResettedIdsNext, 'utf-8');
    }
  }
}

/**
 * recursively traverses given js object. sets "*id", "selectedStory" and "token" properties to "-1".
 * @param {*} object
 * @return {string|{}|*}
 */
function resetIdAndTokenProperties(object) {
  if (!object) {
    return object;
  } else if (Array.isArray(object)) {
    return object.map(resetIdAndTokenProperties);
  } else if (typeof object === 'string') {
    return object;
  } else if (typeof object === 'object') {
    return Object.keys(object).reduce((newObj, k) => {
      if (
        [
          'id',
          'roomId',
          'correlationId',
          'userId',
          'selectedStory',
          'storyId',
          'token',
          'createdAt'
        ].includes(k)
      ) {
        newObj[k] = '-1';
      } else {
        newObj[k] = resetIdAndTokenProperties(object[k]);
      }
      return newObj;
    }, {});
  } else {
    return object; // for everything else that is truthy (boolean true, numbers)
  }
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
