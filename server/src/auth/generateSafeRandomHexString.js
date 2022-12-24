import crypto from 'crypto';

const DEFAULT_LENGTH = 12;

const generateSafeRandomHexString = (length = DEFAULT_LENGTH) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .substr(0, length);

export default generateSafeRandomHexString;
