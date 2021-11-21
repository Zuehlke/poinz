import getDayOfYear from 'date-fns/getDayOfYear';

import {EVENT_ACTION_TYPES} from '../actions/eventActions';
import {getHideNewUserHints, setHideNewUserHints} from '../clientSettingsStore';
import {
  BACKLOG_SIDEBAR_TOGGLED,
  NEW_USER_HINTS_HIDDEN,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_TOGGLED
} from '../actions/uiStateActions';
import {LOCATION_CHANGED} from '../actions/commandActions';

export const uiInitialState = {
  backlogShown: false, // only relevant in mobile view. in desktop the backlog is always visible and not "toggleable"
  sidebar: undefined,
  applause: false,
  unseenError: false,
  easterEggActive: isHalloweenSeason(),
  newUserHintHidden: getHideNewUserHints()
};

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
        return {...state, unseenError: false};
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.leftRoom: {
      if (action.event.userId === ownUserId) {
        return {...uiInitialState};
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.storySelected:
      return {...state, applause: false};
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

    case BACKLOG_SIDEBAR_TOGGLED: {
      const showBacklog = !state.backlogShown;

      if (showBacklog) {
        return {...state, backlogShown: true, sidebar: undefined};
      } else {
        return {...state, backlogShown: false};
      }
    }

    case NEW_USER_HINTS_HIDDEN: {
      setHideNewUserHints(true);
      return {...state, newUserHintHidden: true};
    }
    case LOCATION_CHANGED: {
      return {...state, pathname: action.pathname};
    }

    case EVENT_ACTION_TYPES.commandRejected:
      return {...state, unseenError: true};
  }

  return state;
}

function isHalloweenSeason() {
  const now = new Date();
  const currentDayOfYear = getDayOfYear(now);
  return currentDayOfYear > 288 && currentDayOfYear < 319; // between 15. October and 15.November (close enough, in leap years this is shifted by one day)
}
