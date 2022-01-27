const POINZ_NAMESPACE = 'poinz_';

function getItem(key) {
  return localStorage.getItem(POINZ_NAMESPACE + key);
}

function setItem(key, value) {
  localStorage.setItem(POINZ_NAMESPACE + key, value);
}

export const getUserPresets = () => ({
  username: getPresetUsername(),
  userId: getPresetUserId(),
  avatar: getPresetAvatar(),
  email: getPresetEmail()
});

export const getPresetUsername = () => getItem('presetUserName');
export const setPresetUsername = (username) => setItem('presetUserName', username);

export const getPresetLanguage = () => getItem('presetLanguage');
export const setPresetLanguage = (language) => setItem('presetLanguage', language);

export const getPresetEmail = () => getItem('presetEmail');
export const setPresetEmail = (email) => setItem('presetEmail', email);

export const getPresetAvatar = () => parseInt(getItem('presetAvatar'), 10);
export const setPresetAvatar = (avatar) => setItem('presetAvatar', avatar);

export const getPresetUserId = () => getItem('presetUserId');
export const setPresetUserId = (userId) => setItem('presetUserId', userId);

export const getHideNewUserHints = () => getItem('hideNewUserHints') === 'true';
export const setHideNewUserHints = (flag) => setItem('hideNewUserHints', flag);
export const getMarkdownEnabled = () => getItem('markdownEnabled') === 'true';
export const setMarkdownEnabled = (flag) => setItem('markdownEnabled', flag);
