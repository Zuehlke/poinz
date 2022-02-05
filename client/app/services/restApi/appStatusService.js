/**
 *
 * @return {Promise<*>}
 */
import checkStatusCode from './checkStatusCode';

export function getAppStatus() {
  return fetch('/api/status')
    .then(checkStatusCode)
    .then((response) => response.json());
}
