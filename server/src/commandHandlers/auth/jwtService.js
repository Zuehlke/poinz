import jwt from 'jsonwebtoken';

import generateSalt from './generateSalt';

const ISSUER = 'POINZ';

/*
 * Generate a new Salt on server startup.
 * If the PoinZ server is restarted, all users in password-protected rooms need to re-enter the room password, which is acceptable.
 */
const jwtSalt = generateSalt();

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
    jwtSalt
  );
}

const getExpInMinutesFromNow = (minutes) => Math.floor(Date.now() / 1000) + 60 * minutes;

/**
 * Validates given JWT.
 * - must be encrypted with our salt
 * - issuer must match
 * - roomId must match
 *
 * @param token
 * @param roomId
 * @return {boolean}
 */
export function validateJwt(token, roomId) {
  try {
    return jwt.verify(token, jwtSalt, {
      audience: roomId, // will check if "aud" in payload matches roomId
      issuer: ISSUER
    });
  } catch (err) {
    return undefined;
  }
}
