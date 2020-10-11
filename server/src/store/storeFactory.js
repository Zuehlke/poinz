import persistentStore from './persistentStore';
import inMemoryStore from './inMemoryStore';
import getLogger from '../getLogger';

const LOGGER = getLogger('storeFactory');

/**
 * will return either a persistent or in-memory store
 * @param {boolean | object} persistent Either falsy, then inMemory storage is used, or a configuration object for the persistent storage.
 * @returns {object}
 */
export default async function storeFactory(persistent) {
  const store = persistent ? persistentStore : inMemoryStore;
  await store.init(persistent);

  const houseKeepingResult = await store.housekeeping();
  logHouseKeepingResult(houseKeepingResult);

  return store;
}

function logHouseKeepingResult(result) {
  LOGGER.info(
    `houskeeping for store done. Marked rooms for deletion ${JSON.stringify(
      result.markedForDeletion
    )} (${result.markedForDeletion.length}). Deleted rooms ${JSON.stringify(result.deleted)} (${
      result.deleted.length
    }).`
  );
}
