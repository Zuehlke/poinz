/**
 *
 * @return {Promise<*>}
 */
import checkStatusCode from './checkStatusCode';

/**
 *
 * @param {number} roomLimit
 * @param {number} roomOffset
 * @param onlyActiveRooms
 * @return {Promise<any>}
 */
export function getAppStatus(roomLimit, roomOffset, onlyActiveRooms) {
  return fetch(`/api/status?limit=${roomLimit}&offset=${roomOffset}&onlyActive=${onlyActiveRooms}`)
    .then(checkStatusCode)
    .then((response) => response.json());
}
