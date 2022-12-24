import crypto from 'crypto';

import generateSafeRandomHexString from './generateSafeRandomHexString.js';

/**
 * Checks whether the given cleartext password generates the same hash as the one that is provided.
 *
 * @param {string} cleartextPassword
 * @param {string} hash The hash to compare against
 * @param {string} key The key with which the given hash was generated
 * @return {boolean} Returns true, if the given cleartextPassword generates the same hash. false otherwise.
 */
export function checkRoomPassword(cleartextPassword, hash, key) {
  const hashed = crypto.createHmac('sha512', key);
  const recreatedHash = hashed.update(cleartextPassword).digest('hex');
  return recreatedHash === hash;
}

/**
 *
 * @param cleartextPassword
 * @return {{salt: string, hash: string}}
 */
export function hashRoomPassword(cleartextPassword) {
  const key = generateSafeRandomHexString();
  const hashed = crypto.createHmac('sha512', key);
  const hash = hashed.update(cleartextPassword).digest('hex');
  return {salt: key, hash};
}
