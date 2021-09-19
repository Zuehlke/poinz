import persistentRoomsStore from './persistentRoomsStore';
import inMemoryRoomsStore from './inMemoryRoomsStore';
import getLogger from '../getLogger';

const LOGGER = getLogger('roomStoreFactory');

/**
 * will return either a persistent or in-memory rooms store
 * @param {boolean | string} persistent  Either falsy, then inMemory storage is used, or a db connection URI
 * @returns {{init, getRoomById, saveRoom, getAllRooms}}
 */
export default async function getNewRoomsStore(persistent) {
  const store = persistent ? persistentRoomsStore : inMemoryRoomsStore;
  await store.init(persistent);

  const houseKeepingResult = await store.housekeeping();
  logHouseKeepingResult(houseKeepingResult);

  return store;
}

function logHouseKeepingResult(result) {
  LOGGER.info(
    `houskeeping for roomStore done. Marked rooms for deletion ${JSON.stringify(
      result.markedForDeletion
    )} (${result.markedForDeletion.length}). Deleted rooms ${JSON.stringify(result.deleted)} (${
      result.deleted.length
    }).`
  );
}
