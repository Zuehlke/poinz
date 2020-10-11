import {sign, verify} from 'jsonwebtoken';
import {promisify} from 'util';
import getLogger from '../getLogger';
import githubAuthServiceFactory from './githubAuthService';

const jwtSign = promisify(sign);
const jwtVerify = promisify(verify);

const LOGGER = getLogger('authenticator');

const JWT_EXPIRATION_DURATION = 15 * 60;

/**
 *  Web-Flow:
 *  1. Our Poinz client will direct user to https://github.com/login/oauth/authorize?client_id=63d4040a8662d752a257&state=sergioRandomStateId
 *
 *  2. if user allows Poinz, github will redirect to   http://localhost:9000/poinzstatus/authcb?code=402992f8f4f51b8e2138&state=sergioRandomStateId
 *
 *  3. our poinz client will check state (must be the exact same value).  extract the code and "asks" our backend for a JWT. "requestJWT()"
 *
 *  4. our backend will request the userId from the provider (github).
 *      If successful AND ONLY if we did WHITELIST that userId, a JWT is created.
 *
 * @param store Needed for loading some application config
 *
 * @return {Promise<{object}>}
 */
export default async function authenticatorFactory(store) {
  const authService = await githubAuthServiceFactory(store);
  const config = await store.getAppConfig();
  const {jwtSecret} = config;

  return {
    requestJWT,
    validateJWT
  };

  /**
   *
   * @param {string} code (provided by Identity Provider, currently github)
   * @returns {Promise<string>}
   */
  async function requestJWT(code) {
    const userId = await authService.getUserId(code);

    if (!userId) {
      LOGGER.debug('Cannot create JWT, Invalid code provided!');
      throw new Error('Invalid');
    }

    const whitelisted = await isWhitelistedUser(userId);
    if (!whitelisted) {
      LOGGER.debug(`Will not create JWT, user ${userId} is not whitelisted!`);
      throw new Error('Invalid');
    }

    const nowSeconds = Date.now() / 1000;
    const expires = nowSeconds + JWT_EXPIRATION_DURATION;

    return jwtSign(
      {
        sub: userId,
        exp: expires
      },
      jwtSecret
    );
  }

  /**
   * important to always load config from store,
   * so that we can manipulate user whitelist and it has an immediate effect
   *
   * @param userId
   * @return {Promise<boolean>}
   */
  async function isWhitelistedUser(userId = 0) {
    const config = await store.getAppConfig();
    const {whitelistedUsers} = config;
    return whitelistedUsers && whitelistedUsers.includes(userId.toString());
  }

  /**
   *
   * @param {String} authorizationHeaderField
   * @returns {Promise<string>} returns the userId of the "RequestUser"
   */
  async function validateJWT(authorizationHeaderField) {
    const token = extractTokenFromHeaderField(authorizationHeaderField);
    const decodedToken = await jwtVerify(token, jwtSecret);
    return decodedToken.sub;
  }
}

/**
 * extracts the token from the given httpHeader. Expects "authorizationHeaderField" to be of format "Bearer TOKEN"
 * @private
 * @param {string} authorizationHeaderField
 * @return {undefined|string}
 */
const extractTokenFromHeaderField = (authorizationHeaderField) => {
  if (!authorizationHeaderField) {
    return undefined;
  }

  const matches = authorizationHeaderField.match(/Bearer (.+)/);
  if (!matches || matches.length < 2) {
    return undefined;
  } else {
    return matches[1];
  }
};
