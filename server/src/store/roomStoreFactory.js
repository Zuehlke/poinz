import persistentRoomsStore from './persistentRoomsStore';
import inMemoryRoomsStore from './inMemoryRoomsStore';

/**
 * will return either a persistent or in-memory rooms store
 * @param {boolean | object} persistent  Either falsy, then inMemory storage is used, or a configuration object for the persistent storage.
 * @returns {{init, getRoomById, saveRoom, getAllRooms}}
 */
export default function getNewRoomsStore(persistent) {
  const store = persistent ? persistentRoomsStore : inMemoryRoomsStore;
  store.init(persistent);
  return store;
}
