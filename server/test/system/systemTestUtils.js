import http from 'http';

/**
 * helper method to send HTTP GET requests to the backend under test.
 * parsed returned JSON body to object
 *
 * @param options
 */
export function httpGetJSON(options) {
  return httpGet(options).then((result) => {
    return {
      ...result,
      body: result.body ? JSON.parse(result.body) : ''
    };
  });
}

/**
 * helper method to send HTTP GET requests to the backend under test
 * @param options
 */
function httpGet(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let output = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (output += chunk));
      res.on('end', () => {
        try {
          resolve({statusCode: res.statusCode, body: output});
        } catch (parseError) {
          reject(parseError);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
