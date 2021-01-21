import crypto from 'crypto';

/**
 *
 * @param cleartextPassword
 * @return {{salt: string, hash: string}}
 */
export default function hashRoomPassword(cleartextPassword) {
  const salt = generateSalt();
  const hashed = crypto.createHmac('sha512', salt);
  const hash = hashed.update(cleartextPassword).digest('hex');
  return {salt, hash};
}

const SALT_LENGTH = 12;
const generateSalt = () =>
  crypto
    .randomBytes(Math.ceil(SALT_LENGTH / 2))
    .toString('hex')
    .substr(0, SALT_LENGTH);
