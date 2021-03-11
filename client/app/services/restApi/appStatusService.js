import axios from 'axios';

/**
 *
 * @return {Promise<*>}
 */
export function getAppStatus() {
  return axios.get('/api/status').then((response) => response.data);
}
