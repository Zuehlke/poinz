import axios from 'axios';

export function reportError(type, error) {
  return axios.post('/api/errorlog', {type, error}).then((response) => response.data);
}
