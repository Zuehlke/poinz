import clientSettingsStore from './clientSettingsStore';
import translatorFactory from '../services/translator';

import translationsEN from '../../app/assets/i18n/en.json';
import translationsDE from '../../app/assets/i18n/de.json';

const DEFAULT_LANGUAGE = 'en';
const userLanguage = clientSettingsStore.getPresetLanguage();

const {t, setLanguage} = translatorFactory(
  {
    en: translationsEN,
    de: translationsDE
  },
  userLanguage || DEFAULT_LANGUAGE
);

/**
 * The initial state that is loaded into the redux store on (client) application load.
 */
const INITIAL_STATE = () => ({
  hideNewUserHints: clientSettingsStore.getHideNewUserHints(),
  presetUsername: clientSettingsStore.getPresetUsername(),
  presetEmail: clientSettingsStore.getPresetEmail(),
  presetUserId: clientSettingsStore.getPresetUserId(),
  presetAvatar: clientSettingsStore.getPresetAvatar(),
  userMenuShown: false,
  trashShown: false,
  stories: {},
  estimations: {},
  actionLog: [], // will contain human readable "log messages" of actions that did take place in the current room
  pendingCommands: {}, // will contain pending commands (commands for which no event is received yet)
  language: userLanguage || DEFAULT_LANGUAGE,
  translator: t,
  setLanguage
});

export default INITIAL_STATE;
