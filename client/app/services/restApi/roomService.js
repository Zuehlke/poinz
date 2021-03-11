import axios from 'axios';

const getHeaders = (userToken) => (userToken ? {Authorization: `Bearer ${userToken}`} : {});

/**
 * Get the full room data from the PoinZ backend.
 * besides users, stories and estimations also includes room configuration, card Config, currently selected card, etc.
 *
 * @param {string} roomId
 * @param {string} userToken
 * @return {Promise<*>}
 */
export function getRoom(roomId, userToken) {
  return axios
    .get('/api/room/' + roomId, {
      headers: getHeaders(userToken)
    })
    .then((response) => response.data);
}

/**
 * Get a room object from the PoinZ backend for export.
 * Contains stories, and their estimations
 *
 * @param {string} roomId
 * @param {string} userToken
 * @return {Promise<*>}
 */
export function getRoomExport(roomId, userToken) {
  return axios
    .get('/api/export/room/' + roomId, {
      headers: getHeaders(userToken)
    })
    .then((response) => response.data);
}
