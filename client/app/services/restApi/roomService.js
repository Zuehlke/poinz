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
export async function getRoom(roomId, userToken) {
  const response = await axios.get('/api/room/' + roomId, {
    headers: getHeaders(userToken)
  });

  return response.data;
}

/**
 * Get a room object from the PoinZ backend for export.
 * Contains stories, and their estimations
 *
 * @param {string} roomId
 * @param {string} userToken
 * @return {Promise<*>}
 */
export async function getRoomExport(roomId, userToken) {
  const response = await axios.get('/api/export/room/' + roomId, {
    headers: getHeaders(userToken)
  });

  return response.data;
}
