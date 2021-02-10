import {
  STORY_EDIT_MODE_ENTERED,
  STORY_EDIT_MODE_CANCELLED,
  HIDE_NEW_USER_HINTS,
  SET_LANGUAGE,
  SIDEBAR_ACTIONLOG,
  BACKLOG_SIDEBAR_TOGGLED,
  SIDEBAR_TOGGLED
} from '../actions/uiStateActions';

import {indexEstimations, indexStories, indexUsers} from '../roomStateMapper';
import {COMMAND_SENT, LOCATION_CHANGED} from '../actions/commandActions';
import {EVENT_RECEIVED, ROOM_STATE_FETCHED} from '../actions/eventActions';
import modifyStory from './modifyStory';

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
    case BACKLOG_SIDEBAR_TOGGLED: {
      const showBacklog = !state.backlogShown;

      if (showBacklog) {
        return {...state, backlogShown: true, sidebar: undefined};
      } else {
        return {...state, backlogShown: false};
      }
    }
    case SIDEBAR_TOGGLED: {
      if (state.sidebar === action.sidebarKey) {
        return {
          ...state,
          sidebar: undefined
        };
      } else {
        return {
          ...state,
          sidebar: action.sidebarKey,
          backlogShown: false,
          unseenError: action.sidebarKey === SIDEBAR_ACTIONLOG ? false : state.unseenError
        };
      }
    }
    case STORY_EDIT_MODE_ENTERED: {
      return modifyStory(state, action.storyId, (story) => ({
        ...story,
        editMode: true
      }));
    }
    case STORY_EDIT_MODE_CANCELLED: {
      return modifyStory(state, action.storyId, (story) => ({
        ...story,
        editMode: false
      }));
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
    case ROOM_STATE_FETCHED: {
      const {room} = action;

      if (state.roomId !== room.id) {
        return state;
      }

      return {
        ...state,
        selectedStory: room.selectedStory,
        cardConfig: room.cardConfig,
        autoReveal: room.autoReveal,
        users: indexUsers(room.users),
        stories: indexStories(room.stories),
        estimations: indexEstimations(room.stories),
        passwordProtected: room.passwordProtected
      };
    }

    default:
      return state;
  }
}
