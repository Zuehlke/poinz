import Immutable from 'immutable';

import clientSettingsStore from './clientSettingsStore';
import translator from '../services/translator';


const DEFAULT_LANGUAGE = 'en';
const userLanguage = clientSettingsStore.getPresetLanguage();

/**
 * The initial state that is loaded into the redux store on (client) application load.
 */
const INITIAL_STATE = Immutable.fromJS({
// TODO: evaluate if creator of room must be able to choose card values. store creator's selection to local storage and use as default
  cardConfig: [
    {label: '?', value: -2, color: '#bdbfbf'},
    {label: '1/2', value: 0.5, color: '#667a66'},
    {label: '1', value: 1, color: '#839e7a'},
    {label: '2', value: 2, color: '#8cb876'},
    {label: '3', value: 3, color: '#96ba5b'},
    {label: '5', value: 5, color: '#b6c76b'},
    {label: '8', value: 8, color: '#c9c857'},
    {label: '13', value: 13, color: '#d9be3b'},
    {label: '21', value: 21, color: '#d6cda1'},
    {label: '34', value: 34, color: '#9fa6bd'},
    {label: '55', value: 55, color: '#6a80ab'},
    {label: 'BIG', value: -1, color: '#1d508f'}
  ],
  presetUsername: clientSettingsStore.getPresetUsername(),
  presetEmail: clientSettingsStore.getPresetEmail(),
  presetUserId: clientSettingsStore.getPresetUserId(),
  roomHistory: clientSettingsStore.getRoomHistory(),
  actionLog: [], // will contain human readable "log messages" of actions that did take place in the current room
  pendingCommands: {}, // will contain pending commands (commands for which no event is received yet)
  language: userLanguage || DEFAULT_LANGUAGE,
  translator: key => translator(key, userLanguage || DEFAULT_LANGUAGE)
});

export default INITIAL_STATE;
