import jwt from 'jsonwebtoken';

import generateSafeRandomHexString from './generateSafeRandomHexString.js';

const ISSUER = 'POINZ';

/*
 * Generate a new secret on server startup.
 * If the Poinz server is restarted, all users in password-protected rooms need to re-enter the room password, which is acceptable.
 */
const jwtSecret = generateSafeRandomHexString();

/**
 * generate a new JWT for the given user in the given room
 * @param userId
 * @param roomId
 * @return {string}
 */
export function issueJwt(userId, roomId) {
  return jwt.sign(
    {
      exp: getExpInMinutesFromNow(60),
      sub: userId,
      aud: roomId,
      iss: ISSUER
    },
    jwtSecret
  );
}

const getExpInMinutesFromNow = (minutes) => Math.floor(Date.now() / 1000) + 60 * minutes;

/**
 * Verifies given JWT.
 * - must be encrypted with our secret key
 * - issuer must match
 * - roomId must match
 *
 * @param token
 * @param {string} roomId
 * @return {object | undefined} The token payload if JWT is valid. undefined otherwise.
 */
export function verifyJwt(token, roomId) {
  try {
    return jwt.verify(token, jwtSecret, {
      audience: roomId, // will check if "aud" in payload matches roomId
      issuer: ISSUER
    });
  } catch (err) {
    return undefined;
  }
}
