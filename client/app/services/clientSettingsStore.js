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
function getPresetUserId() {
  return getItem('presetUserId');
}
function setPresetUserId(username) {
  setItem('presetUserId', username);
}
function addRoomToHistory(roomId) {
  const history = getRoomHistory();
  if (history.indexOf(roomId) > -1) {
    return;
  }
  history.unshift(roomId);
  setItem('roomHistory', JSON.stringify(history.slice(0, 5)));
}

function getRoomHistory() {
  try {
    const serializedHistory = getItem('roomHistory');
    return serializedHistory ? JSON.parse(serializedHistory) : [];
  } catch (parseError) {
    // history is not important. if data is not parsable, just return empty array.
    return [];
  }
}

export default {
  getPresetUsername,
  setPresetUsername,
  getPresetLanguage,
  setPresetLanguage,
  getPresetEmail,
  setPresetEmail,
  getPresetUserId,
  setPresetUserId,
  addRoomToHistory,
  getRoomHistory
};
