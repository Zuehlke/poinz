import checkStatusCode from './checkStatusCode';

export function reportError(type, error) {
  return fetch('/api/errorlog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({type, error})
  })
    .then(checkStatusCode)
    .then((response) => response.text());
}
