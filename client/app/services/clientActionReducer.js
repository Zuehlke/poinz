import log from 'loglevel';

import clientSettingsStore from '../store/clientSettingsStore';
import translator from './translator';
import {
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  TOGGLE_LOG,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  COMMAND_SENT,
  EVENT_RECEIVED,
  STATUS_FETCHED,
  SET_LANGUAGE,
  LOCATION_CHANGED
} from '../actions/types';

/**
 *  The client Action Reducer handles actions triggered by the client (view state, etc.)
 *
 * @param {object} state
 * @param {object} action
 * @returns {object} the modified state
 */
export default function clientActionReducer(state, action) {
  switch (action.type) {
    case COMMAND_SENT: {
      // for every command we send, let's store it in our client state as "pending command". various view components
      // are then able to display "spinners" when waiting for the corresponding backend event.
      // limitations:
      // - the first event produced by a command will remove it (consider that the backend might produce N events for a single command that is processed)
      // - if the backend does not produce an event for a command, the command will remain in the client state.

      const modifiedPendingCommands = {
        ...state.pendingCommands,
        [action.command.id]: action.command
      };
      return {...state, pendingCommands: modifiedPendingCommands};
    }
    case EVENT_RECEIVED: {
      // for every event that we receive, we remove the corresponding command if any. (i.e. the command that triggered that event in the backend)

      delete state.pendingCommands[action.correlationId];
      const modifiedPendingCommands = {...state.pendingCommands};
      return {...state, pendingCommands: modifiedPendingCommands};
    }
    case TOGGLE_BACKLOG: {
      return {...state, backlogShown: !state.backlogShown};
    }
    case TOGGLE_USER_MENU: {
      const showMenu = !state.userMenuShown;

      if (showMenu) {
        return {...state, userMenuShown: true, logShown: false};
      } else {
        return {...state, userMenuShown: false};
      }
    }
    case TOGGLE_LOG: {
      const showLog = !state.logShown;

      if (showLog) {
        return {...state, logShown: true, userMenuShown: false};
      } else {
        return {...state, logShown: false};
      }
    }
    case EDIT_STORY: {
      const modifiedStories = {
        ...state.stories,
        [action.storyId]: {...state.stories[action.storyId], editMode: true}
      };
      return {...state, stories: modifiedStories};
    }
    case CANCEL_EDIT_STORY: {
      const modifiedStories = {
        ...state.stories,
        [action.storyId]: {...state.stories[action.storyId], editMode: false}
      };
      return {...state, stories: modifiedStories};
    }
    case STATUS_FETCHED: {
      return {
        ...state,
        appStatus: action.status
      };
    }
    case SET_LANGUAGE: {
      const language = action.language;
      clientSettingsStore.setPresetLanguage(language);
      return {...state, language, translator: (key) => translator(key, language)};
    }

    case LOCATION_CHANGED: {
      return {...state, pathname: action.pathname};
    }

    default:
      log.warn('unknown action', action);
      return state;
  }
}
