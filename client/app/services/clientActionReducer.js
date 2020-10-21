import {
  TOGGLE_BACKLOG,
  TOGGLE_SETTINGS,
  TOGGLE_LOG,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  COMMAND_SENT,
  EVENT_RECEIVED,
  STATUS_FETCHED,
  SET_LANGUAGE,
  LOCATION_CHANGED,
  HIDE_NEW_USER_HINTS,
  SHOW_TRASH,
  HIDE_TRASH,
  TOGGLE_MARK_FOR_KICK
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

      if (action.command.name === 'joinRoom') {
        // special case, we need to remember that we are joining / waiting for "joinedRoom"
        // if first-time user, we don't have a userId. we need to know, if it is "us" that joins...

        return {
          ...state,
          pendingCommands: modifiedPendingCommands,
          pendingJoinCommandId: action.command.id
        };
      }

      return {...state, pendingCommands: modifiedPendingCommands};
    }
    case EVENT_RECEIVED: {
      // for every event that we receive, we remove the corresponding command if any. (i.e. the command that triggered that event in the backend)

      delete state.pendingCommands[action.correlationId];
      const modifiedPendingCommands = {...state.pendingCommands};
      return {...state, pendingCommands: modifiedPendingCommands};
    }
    case TOGGLE_BACKLOG: {
      const showBacklog = !state.backlogShown;

      if (showBacklog) {
        return {...state, backlogShown: true, settingsShown: false, logShown: false};
      } else {
        return {...state, backlogShown: false};
      }
    }
    case TOGGLE_SETTINGS: {
      const showMenu = !state.settingsShown;

      if (showMenu) {
        return {...state, settingsShown: true, logShown: false, backlogShown: false};
      } else {
        return {...state, settingsShown: false};
      }
    }
    case TOGGLE_LOG: {
      const showLog = !state.logShown;

      if (showLog) {
        return {
          ...state,
          logShown: true,
          unseenError: false,
          settingsShown: false,
          backlogShown: false
        };
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
      const newTranslatorFunction = state.setLanguage(language);
      return {
        ...state,
        language,
        // make sure to replace the translator function, so that all components that have translated UI elements get re-rendered
        translator: newTranslatorFunction
      };
    }
    case HIDE_NEW_USER_HINTS: {
      return {...state, hideNewUserHints: true};
    }
    case LOCATION_CHANGED: {
      return {...state, pathname: action.pathname};
    }
    case SHOW_TRASH: {
      return {...state, trashShown: true};
    }
    case HIDE_TRASH: {
      return {...state, trashShown: false};
    }
    case TOGGLE_MARK_FOR_KICK: {
      if (state.userId === action.userId) {
        return state; // no use in marking myself.. backend will prevent "kick" command for my own user anyways
      }
      const doMark = !state.users[action.userId].markedForKick;

      const modifiedUsers = {
        ...state.users,
        [action.userId]: {...state.users[action.userId], markedForKick: doMark}
      };
      return {...state, users: modifiedUsers};
    }

    default:
      return state;
  }
}
