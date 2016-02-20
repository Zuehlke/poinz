const SPLUSH_NS = 'splush_';

function getItem(key) {
  return localStorage.getItem(SPLUSH_NS + key);
}

function setItem(key, value) {
  localStorage.setItem(SPLUSH_NS + key, value);
}

function getPresetUsername() {
  return getItem('presetUserName');
}
function setPresetUsername(username) {
  return setItem('presetUserName', username);
}
function getPresetUserId() {
  return getItem('presetUserId');
}
function setPresetUserId(username) {
  return setItem('presetUserId', username);
}

export default {
  getPresetUsername,
  setPresetUsername,
  getPresetUserId,
  setPresetUserId
};
