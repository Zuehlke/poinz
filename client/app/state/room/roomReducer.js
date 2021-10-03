import {EVENT_ACTION_TYPES, ROOM_STATE_FETCHED} from '../actions/eventActions';
import {storiesInitialState} from '../stories/storiesReducer';

export const roomInitialState = {
  roomId: undefined,
  autoReveal: true,
  withConfidence: false,
  passwordProtected: false,
  cardConfig: {
    ordered: [],
    byValue: {}
  }
};

/**
 *
 * @param {object} state The "room" portion of the redux state
 * @param action
 * @param {string | undefined} ownUserId
 * @return
 */
export default function roomReducer(state = roomInitialState, action, ownUserId) {
  const {event} = action;

  switch (action.type) {
    case ROOM_STATE_FETCHED: {
      return {
        ...state,
        autoReveal: action.room.autoReveal,
        withConfidence: action.room.withConfidence,
        passwordProtected: action.room.passwordProtected,
        cardConfig: {
          ordered: action.room.cardConfig,
          byValue: indexCcByValue(action.room.cardConfig)
        }
      };
    }

    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        return {
          ...state,
          roomId: event.roomId,
          autoReveal: event.payload.autoReveal,
          withConfidence: event.payload.withConfidence,
          passwordProtected: event.payload.passwordProtected,
          cardConfig: {
            ordered: event.payload.cardConfig,
            byValue: indexCcByValue(event.payload.cardConfig)
          }
        };
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.leftRoom: {
      if (event.userId === ownUserId) {
        return {...roomInitialState};
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.kicked: {
      if (event.payload.userId === ownUserId) {
        return {...storiesInitialState};
      } else {
        return state;
      }
    }

    case EVENT_ACTION_TYPES.cardConfigSet:
      return {
        ...state,
        cardConfig: {
          ordered: event.payload.cardConfig,
          byValue: indexCcByValue(event.payload.cardConfig)
        }
      };

    case EVENT_ACTION_TYPES.autoRevealOn:
      return {
        ...state,
        autoReveal: true
      };
    case EVENT_ACTION_TYPES.autoRevealOff:
      return {
        ...state,
        autoReveal: false
      };
    case EVENT_ACTION_TYPES.confidenceOn:
      return {
        ...state,
        withConfidence: true
      };
    case EVENT_ACTION_TYPES.confidenceOff:
      return {
        ...state,
        withConfidence: false
      };
    case EVENT_ACTION_TYPES.passwordSet:
      return {
        ...state,
        passwordProtected: true
      };
    case EVENT_ACTION_TYPES.passwordCleared:
      return {
        ...state,
        passwordProtected: false
      };
  }

  return state;
}

const indexCcByValue = (cardConfigArray) =>
  cardConfigArray.reduce((result, currentCC) => {
    result[currentCC.value] = currentCC;
    return result;
  }, {});
