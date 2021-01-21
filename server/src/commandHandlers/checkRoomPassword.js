import crypto from 'crypto';

/**
 * Checks whether the given cleartext password generates the same hash as the one that is provided.
 *
 * @param {string} cleartextPassword
 * @param {string} hash The hash to compare against
 * @param {string} salt The salt with which the given hash was generated
 * @return {boolean} Returns true, if the given cleartextPassword generates the same hash. false otherwise.
 */
export default function checkRoomPassword(cleartextPassword, hash, salt) {
  const hashed = crypto.createHmac('sha512', salt);
  const recreatedHash = hashed.update(cleartextPassword).digest('hex');
  return recreatedHash === hash;
}
