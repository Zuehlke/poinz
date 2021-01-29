import axios from 'axios';

/**
 *
 * @return {Promise<*>}
 */
export async function getAppStatus() {
  const response = await axios.get('/api/status');
  return response.data;
}
