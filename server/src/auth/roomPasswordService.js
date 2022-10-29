import crypto from 'crypto';

import generateSalt from './generateSalt.js';

/**
 * Checks whether the given cleartext password generates the same hash as the one that is provided.
 *
 * @param {string} cleartextPassword
 * @param {string} hash The hash to compare against
 * @param {string} salt The salt with which the given hash was generated
 * @return {boolean} Returns true, if the given cleartextPassword generates the same hash. false otherwise.
 */
export function checkRoomPassword(cleartextPassword, hash, salt) {
  const hashed = crypto.createHmac('sha512', salt);
  const recreatedHash = hashed.update(cleartextPassword).digest('hex');
  return recreatedHash === hash;
}

/**
 *
 * @param cleartextPassword
 * @return {{salt: string, hash: string}}
 */
export function hashRoomPassword(cleartextPassword) {
  const salt = generateSalt();
  const hashed = crypto.createHmac('sha512', salt);
  const hash = hashed.update(cleartextPassword).digest('hex');
  return {salt, hash};
}
