import roomsStore from './roomsStore';
import inMemoryRoomsStore from './inMemoryRoomsStore';

/**
 * will return either a persistent or in-memory rooms store
 * @param {boolean} persistent
 * @returns {{init, getRoomById, saveRoom, getAllRooms}}
 */
export default function getNewRoomsStore(persistent) {
  const store = persistent ? roomsStore : inMemoryRoomsStore;
  store.init();
  return store;
}
