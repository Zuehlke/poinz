import crypto from 'crypto';

const DEFAULT_SALT_LENGTH = 12;

const generateSalt = (saltLength = DEFAULT_SALT_LENGTH) =>
  crypto
    .randomBytes(Math.ceil(saltLength / 2))
    .toString('hex')
    .substr(0, saltLength);

export default generateSalt;
