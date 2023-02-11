import checkStatusCode from './checkStatusCode';

const buildHeaderObject = (userToken) => (userToken ? {Authorization: `Bearer ${userToken}`} : {});

/**
 * Get the full room data from the Poinz backend.
 * besides users, stories and estimations also includes room configuration, card Config, currently selected card, etc.
 *
 * @param {string} roomId
 * @param {string} userToken
 * @return {Promise<*>}
 */
export function getRoom(roomId, userToken) {
  return fetch('/api/room/' + roomId, {
    headers: buildHeaderObject(userToken)
  })
    .then(checkStatusCode)
    .then((response) => response.json());
}

/**
 * Get a room object from the Poinz backend for export.
 * Contains stories, and their estimations
 *
 * @param {string} roomId
 * @param {string} userToken
 * @return {Promise<*>}
 */
export function getRoomExport(roomId, userToken) {
  return fetch('/api/export/room/' + roomId, {
    headers: buildHeaderObject(userToken)
  })
    .then(checkStatusCode)
    .then((response) => response.json());
}
