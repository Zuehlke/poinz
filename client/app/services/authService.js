import axios from 'axios';

import clientSettingsStore from '../store/clientSettingsStore';
import history from './getBrowserHistory';

/**
 * Ask our backend for a JWT. we need a valid github code (which is provided as url query parameter by github on callback)
 */
export async function loadJwtFromPoinzServer() {
  const {code, state: ghState} = getGithubCodeAndStateFromSearch(history.location.search);
  const ghStateLocal = clientSettingsStore.getGithubLoginState();
  clientSettingsStore.setGithubLoginState('');

  if (!ghStateLocal || ghStateLocal !== ghState) {
    throw new Error('Github Auth Flow state mismatch!');
  }

  const response = await axios.get('/api/auth/jwt?code=' + code);
  if (response && response.data) {
    return response.data;
  }
}

/**
 * Forward the user to github in order to authorize "Poinz" app (specified by githubClientId, which is a configurable).
 */
export async function authenticateWithGithub() {
  const response = await axios.get('/api/auth/config');

  if (response.status !== 200 || !response.data || !response.data.githubClientId) {
    throw new Error('could not load auth config from poinz backend');
  }

  const githubLoginState = generateGHLoginStateId(32);
  clientSettingsStore.setGithubLoginState(githubLoginState);
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${response.data.githubClientId}&state=${githubLoginState}`;
  window.location.replace(githubAuthUrl);
}

// dec2hex :: Integer -> String
// i.e. 0-255 -> '00'-'ff'
const dec2hex = (dec) => (dec < 10 ? '0' + String(dec) : dec.toString(16));

// generateId :: Integer -> String
const generateGHLoginStateId = (len) => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

const getGithubCodeAndStateFromSearch = (search) => {
  const sp = new URLSearchParams(search.substring(1));
  return {
    code: sp.get('code'),
    state: sp.get('state')
  };
};
