import fetch from 'node-fetch';
import getLogger from '../getLogger';

const LOGGER = getLogger('githubAuthService');

/**
 *
 * See  https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps#web-application-flow
 *
 */

/**
 *
 * @param store  Needed for loading some application config
 * @return {Promise<{object}>}
 */
export default async function githubAuthServiceFactory(store) {
  const config = await store.getAppConfig();
  const {githubAuthClientId: githubClientId, githubAuthSecret: githubClientSecret} = config;

  return {
    getUserId
  };

  /**
   * Returns the github user id if the given code is valid.
   * Otherwise will return undefined
   *
   * @param githubCode
   * @return {Promise<{valid:*,exp:*,sub:*}>}
   */
  async function getUserId(githubCode) {
    const accessToken = await getGithubAccessTokenForCode(githubCode);

    if (!accessToken) {
      return undefined;
    }

    return await getGithubUserId(accessToken);
  }

  /**
   *
   * @param accessToken
   * @return {Promise<undefined|*>}
   */
  async function getGithubUserId(accessToken) {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {Accept: 'application/json', Authorization: 'token ' + accessToken}
    });

    const responseBody = await response.json();

    if (!responseBody.id) {
      LOGGER.info('Could not get github userId: ' + responseBody.message);
      return undefined;
    }

    return responseBody.id;
  }

  /**
   * github will return
   *
   {
    "access_token": "f77fb955c262226f6c61b1cc84dd1b057b9e86d2",
    "token_type": "bearer",
    "scope": ""
   }
   * on valid "githubCode"
   *
   * @param githubCode
   * @return {Promise<undefined>}
   */
  async function getGithubAccessTokenForCode(githubCode) {
    try {
      const params = new URLSearchParams();
      params.append('client_id', githubClientId);
      params.append('client_secret', githubClientSecret);
      params.append('code', githubCode);
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: params,
        headers: {Accept: 'application/json'}
      });
      const responseBody = await response.json();

      if (responseBody.error) {
        LOGGER.info(
          `Could not get accessToken: ${responseBody.error}: ${responseBody.error_description}.  clientId=${githubClientId}, clientSecret=${githubClientSecret}`
        );
        return undefined;
      }

      return responseBody.access_token;
    } catch (e) {
      LOGGER.error(e.message);
      return undefined;
    }
  }
}

/**
 * example response
 {
  "login": "xeronimus",
  "id": 1777143,
  "node_id": "MDQ6VXNlcjE3NzcxNDM=",
  "avatar_url": "https://avatars0.githubusercontent.com/u/1777143?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/xeronimus",
  "html_url": "https://github.com/xeronimus",
  "followers_url": "https://api.github.com/users/xeronimus/followers",
  "following_url": "https://api.github.com/users/xeronimus/following{/other_user}",
  "gists_url": "https://api.github.com/users/xeronimus/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/xeronimus/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/xeronimus/subscriptions",
  "organizations_url": "https://api.github.com/users/xeronimus/orgs",
  "repos_url": "https://api.github.com/users/xeronimus/repos",
  "events_url": "https://api.github.com/users/xeronimus/events{/privacy}",
  "received_events_url": "https://api.github.com/users/xeronimus/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Sergio Trentini",
  "company": null,
  "blog": "",
  "location": "Zürich",
  "email": "xeronimus@gmail.com",
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 22,
  "public_gists": 3,
  "followers": 14,
  "following": 12,
  "created_at": "2012-05-25T08:13:23Z",
  "updated_at": "2020-09-30T05:26:40Z"
}
 */
