import {getItem, persistOnStateChange} from '../clientSettingsStore';
import {EVENT_ACTION_TYPES} from '../actions/eventActions';
import {LOCATION_CHANGED} from '../actions/commandActions';
import {DEFAULT_BACKLOG_WIDTH} from '../../components/dimensions';

import {
  BACKLOG_SIDEBAR_TOGGLED,
  MARKDOWN_TOGGLED,
  MATRIX_TOGGLED,
  NEW_USER_HINTS_HIDDEN,
  MATRIX_INCL_TRSH_TOGGLED,
  SOUND_EFFECTS_TOGGLED,
  SOUND_EFFECTS_VOLUME_SET,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_TOGGLED,
  BACKLOG_WIDTH_SET
} from '../actions/uiStateActions';
import {getActiveSeasonalEasterEgg} from '../../components/common/EasterEgg';

const HIDE_NEW_USER_HINTS = 'hideNewUserHints';
const MARKDOWN_ENABLED = 'markdownEnabled';
const BACKLOG_WIDTH = 'backlogWidth';
const SOUND_EFFECTS_ENABLED = 'soundEffectsEnabled';
const SOUND_EFFECTS_VOLUME = 'soundEffectsVolume';
const storedSoundEffectsVolume = getItem(SOUND_EFFECTS_VOLUME);
const persistedSoundEffectsVolume = Number(storedSoundEffectsVolume);
const initialSoundEffectsVolume =
  storedSoundEffectsVolume !== null && Number.isFinite(persistedSoundEffectsVolume)
  ? Math.min(100, Math.max(0, persistedSoundEffectsVolume))
  : 50;

export const uiInitialState = {
  backlogShown: false, // only relevant in mobile view. in desktop the backlog is always visible and not "toggleable"
  backlogWidth: parseInt(getItem(BACKLOG_WIDTH) || DEFAULT_BACKLOG_WIDTH, 10),
  sidebar: undefined,
  matrixShown: false,
  applause: false,
  unseenError: false,
  newUserHintHidden: getItem(HIDE_NEW_USER_HINTS) === 'true',
  markdownEnabled: getItem(MARKDOWN_ENABLED) === 'true',
  soundEffectsEnabled: getItem(SOUND_EFFECTS_ENABLED) === 'true',
  soundEffectsVolume: initialSoundEffectsVolume,
  activeEasterEgg: getActiveSeasonalEasterEgg(new Date()), // will be either a easterEgg Season Spec or undefined
  matrixIncludeTrashedStories: false
};

persistOnStateChange(MARKDOWN_ENABLED, (state) => state.ui.markdownEnabled);
persistOnStateChange(HIDE_NEW_USER_HINTS, (state) => state.ui.newUserHintHidden);
persistOnStateChange(BACKLOG_WIDTH, (state) => state.ui.backlogWidth);
persistOnStateChange(SOUND_EFFECTS_ENABLED, (state) => state.ui.soundEffectsEnabled);
persistOnStateChange(SOUND_EFFECTS_VOLUME, (state) => state.ui.soundEffectsVolume);

/**
 *
 * @param {object} state The "ui" portion of the redux state
 * @param action
 * @param {string | undefined} ownUserId
 * @return {object}
 */
export default function uiReducer(state = uiInitialState, action, ownUserId) {
  switch (action.type) {
    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        return {
          ...state,
          unseenError: false
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.leftRoom: {
      if (action.event.userId === ownUserId) {
        return {
          ...uiInitialState,
          soundEffectsEnabled: state.soundEffectsEnabled,
          soundEffectsVolume: state.soundEffectsVolume
        };
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.storySelected: {
      return {...state, applause: false};
    }
    case EVENT_ACTION_TYPES.consensusAchieved:
      return {...state, applause: true};
    case EVENT_ACTION_TYPES.newEstimationRoundStarted:
      return {...state, applause: false};

    //  ui only actions, triggered by the user. e.g. hide / show menues, etc.

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

    case BACKLOG_WIDTH_SET: {
      return {
        ...state,
        backlogWidth: action.width
      };
    }

    case MATRIX_TOGGLED: {
      return {
        ...state,
        matrixShown: !state.matrixShown
      };
    }

    case MATRIX_INCL_TRSH_TOGGLED: {
      return {
        ...state,
        matrixIncludeTrashedStories: !state.matrixIncludeTrashedStories
      };
    }

    case BACKLOG_SIDEBAR_TOGGLED: {
      const showBacklog = !state.backlogShown;

      if (showBacklog) {
        return {...state, backlogShown: true, sidebar: undefined};
      } else {
        return {...state, backlogShown: false};
      }
    }

    case NEW_USER_HINTS_HIDDEN: {
      return {...state, newUserHintHidden: true};
    }
    case MARKDOWN_TOGGLED: {
      return {...state, markdownEnabled: !state.markdownEnabled};
    }
    case SOUND_EFFECTS_TOGGLED: {
      return {...state, soundEffectsEnabled: !state.soundEffectsEnabled};
    }
    case SOUND_EFFECTS_VOLUME_SET: {
      return {...state, soundEffectsVolume: Math.min(100, Math.max(0, action.volume))};
    }
    case LOCATION_CHANGED: {
      return {...state, pathname: action.pathname};
    }

    case EVENT_ACTION_TYPES.commandRejected: {
      return {...state, unseenError: true};
    }
  }

  return state;
}
