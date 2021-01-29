import axios from 'axios';

/**
 * Get the full room data from the PoinZ backend.
 * besides users, stories and estimations also includes room configuration, card Config, currently selected card, etc.
 *
 * @param roomId
 * @param userId
 * @return {Promise<*>}
 */
export async function getRoom(roomId, userId) {
  const response = await axios.get('/api/room/' + roomId, {
    headers: {'X-USER': userId}
  });

  return response.data;
}

/**
 * Get a room object from the PoinZ backend for export.
 * Contains stories, and their estimations
 *
 * @param roomId
 * @param userId
 * @return {Promise<*>}
 */
export async function getRoomExport(roomId, userId) {
  const response = await axios.get('/api/export/room/' + roomId, {
    headers: {'X-USER': userId}
  });

  return response.data;
}
