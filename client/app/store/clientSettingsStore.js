const POINZ_NS = 'poinz_';

function getItem(key) {
  return localStorage.getItem(POINZ_NS + key);
}

function setItem(key, value) {
  localStorage.setItem(POINZ_NS + key, value);
}

function getPresetUsername() {
  return getItem('presetUserName');
}

function setPresetUsername(username) {
  setItem('presetUserName', username);
}

function getPresetLanguage() {
  return getItem('presetLanguage');
}

function setPresetLanguage(language) {
  setItem('presetLanguage', language);
}

function getPresetEmail() {
  return getItem('presetEmail');
}

function setPresetEmail(email) {
  setItem('presetEmail', email);
}

function getPresetAvatar() {
  return parseInt(getItem('presetAvatar'), 10);
}

function setPresetAvatar(avatar) {
  setItem('presetAvatar', avatar);
}

function getPresetUserId() {
  return getItem('presetUserId');
}

function setPresetUserId(userId) {
  setItem('presetUserId', userId);
}

function getHideNewUserHints() {
  return getItem('hideNewUserHints') === 'true';
}

function setHideNewUserHints(flag) {
  setItem('hideNewUserHints', flag);
}

function setGithubLoginState(state) {
  setItem('githubLoginState', state);
}
function getGithubLoginState() {
  return getItem('githubLoginState');
}

export default {
  getPresetUsername,
  setPresetUsername,
  getPresetLanguage,
  setPresetLanguage,
  getPresetEmail,
  setPresetEmail,
  getPresetAvatar,
  setPresetAvatar,
  getPresetUserId,
  setPresetUserId,
  getHideNewUserHints,
  setHideNewUserHints,
  getGithubLoginState,
  setGithubLoginState
};
