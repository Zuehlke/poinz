import log from 'loglevel';
import {EVENT_ACTION_TYPES} from '../actions/types';
import clientSettingsStore from '../store/clientSettingsStore';
import initialState from '../store/initialState';
import history from './getBrowserHistory';

const LOGGER = log.getLogger('eventReducer');

/**
 * The event reducer handles backend-event actions.
 * These are equivalent to the event handlers in the backend as they modify the room state.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object} the modified state
 */
export default function eventReducer(state, action) {

  const {event} = action;

  // if we created a new room, and then joined, we don't have a roomId yet
  if (!state.roomId && event.name === 'joinedRoom') {
    state.roomId = event.roomId;
  }

  // Events from other rooms do not affect us (backend should not send such events in the first place)
  // so we do not modify our client-side state in any way
  if (state.roomId !== event.roomId) {
    LOGGER.warn(`Event with different roomId received. localRoomId=${state.roomId}, eventRoomId=${event.roomId} (${event.name})`);
    return state;
  }

  const matchingHandler = eventActionHandlers[action.type];
  if (!matchingHandler) {
    LOGGER.warn('No matching backend-event handler for', action);
    return state;
  }

  let modifiedState = matchingHandler.fn(state, event.payload, event) || state;
  modifiedState = updateActionLog(matchingHandler.log, state, modifiedState, event);
  return modifiedState;
}

/**
 * adds a log message for a backend event to the state.
 *
 * @param {undefined | string | function} logObject defined in event handlers. If this is a function: username, eventPayload, oldState and newState will be passed.
 * @param {object} oldState The state before the action was reduced
 * @param {object} modifiedState The state after the action was reduced
 * @param {object} event
 * @returns {object} The new state containing updated actionLog
 */
function updateActionLog(logObject, oldState, modifiedState, event) {
  if (!logObject) {
    return modifiedState;
  }

  const matchingUser = modifiedState.users && modifiedState.users[event.userId];
  const username = matchingUser ? matchingUser.username || '' : '';
  const message = (typeof logObject === 'function') ? logObject(username, event.payload, oldState, modifiedState, event) : logObject;

  return {
    ...modifiedState,
    actionLog: [...modifiedState.actionLog || [], {
      tstamp: new Date(),
      message
    }]
  };

}

/**
 * Map of event handlers.
 *
 * Defines the modification (application/reduction) a backend event performs on our state.
 * Also defines an optional log function or string (this is separated intentionally - even though it is technically also a modification to the state).
 *
 * TODO:  decide/discuss whether we should split these up into separate files (similar to backend)
 */
const eventActionHandlers = {

  /**
   * If the user joins a room that does not yet exist, it is created by the backend.
   * It will be followed by a "roomJoined" event.
   */
  [EVENT_ACTION_TYPES.roomCreated]: {
    fn: (state) => state,
    log: (username, payload) => `Room "${payload.id}" created`
  },

  /**
   * A user joined the room. This can be either your own user or someone else joined the room.
   */
  [EVENT_ACTION_TYPES.joinedRoom]: {
    fn: (state, payload, event) => {

      if (state.userId) {
        // if our client state has already a userId set, this event indicates that someone else joined
        const modifiedUsers = {...state.users};
        modifiedUsers[payload.userId] = payload.users[payload.userId];
        return {
          ...state,
          users: modifiedUsers
        };
      } else {
        // you joined

        // set the page title
        document.title = `PoinZ - ${event.roomId}`;
        history.push('/' + event.roomId);

        clientSettingsStore.setPresetUserId(payload.userId);
        clientSettingsStore.addRoomToHistory(event.roomId);

        // server sends current room state (users, stories, etc.)
        return {
          ...state,
          roomId: event.roomId,
          userId: payload.userId,
          selectedStory: payload.selectedStory,
          users: payload.users || {},
          stories: payload.stories || {}
        };


      }
    },
    log: (username, payload, oldState, newState) => {
      return (oldState.userId) ? `User ${username} joined` : `You joined room "${newState.roomId}"`;
    }
  },

  /**
   * A user left the room. This can be either your own user. Or someone else left the room.
   */
  [EVENT_ACTION_TYPES.leftRoom]: {
    fn: (state, payload) => {

      const isOwnUser = state.userId === payload.userId;

      if (isOwnUser) {
        // you (or you in another browser) left the room

        // set the page title
        document.title = 'PoinZ';

        // let's reset our state
        return {...initialState};

      } else {
        // someone else left the room

        const modifiedStories = Object.values(state.stories).reduce((result, currentStory) => {
          const leavingUserHasEstimatedStory = Object.keys(currentStory.estimations).find(userId => userId === payload.userId);
          if (!leavingUserHasEstimatedStory) {
            result[currentStory.id] = currentStory;
          } else {
            const modifiedEstimations = {...currentStory.estimations};
            delete modifiedEstimations[payload.userId];
            result[currentStory.id] = {...currentStory, estimations: modifiedEstimations};
          }
          return result;
        }, {});
        const modifiedUsers = {...state.users};
        delete modifiedUsers[payload.userId];

        return {...state, stories: modifiedStories, users: modifiedUsers};
      }
    },
    log: (username, payload, oldState) => `User ${oldState.users[payload.userId].username} left the room`
  },

  /**
   * A disconnected user was kicked from the room.
   */
  [EVENT_ACTION_TYPES.kicked]: {
    fn: (state, payload) => {
      const modifiedStories = Object.values(state.stories).reduce((result, currentStory) => {
        const leavingUserHasEstimatedStory = Object.keys(currentStory.estimations).find(userId => userId === payload.userId);
        if (!leavingUserHasEstimatedStory) {
          result[currentStory.id] = currentStory;
        } else {
          const modifiedEstimations = {...currentStory.estimations};
          delete modifiedEstimations[payload.userId];
          result[currentStory.id] = {...currentStory, estimations: modifiedEstimations};
        }
        return result;
      }, {});
      const modifiedUsers = {...state.users};
      delete modifiedUsers[payload.userId];

      return {...state, stories: modifiedStories, users: modifiedUsers};
    },
    log: (username, payload, oldState) => `User ${oldState.users[payload.userId].username} was kicked from the room by another user`
  },

  /**
   * A user in the room lost the connection to the server.
   */
  [EVENT_ACTION_TYPES.connectionLost]: {
    fn: (state, payload) => {

      if (state.users[payload.userId]) {
        return {
          ...state,
          users: {...state.users, [payload.userId]: {...state.users[payload.userId], disconnected: true}}
        };
      } else {
        return state;
      }

    },
    log: (username) => `${username} lost the connection`
  },

  [EVENT_ACTION_TYPES.storyAdded]: {
    fn: (state, payload) => {
      const modifiedStories = {...state.stories};
      modifiedStories[payload.id] = payload;
      return {
        ...state,
        stories: modifiedStories
      };
    },
    log: (username, payload) => `${username} added new story "${payload.title}"`
  },

  [EVENT_ACTION_TYPES.storyChanged]: {
    fn: (state, payload) => {

      const modifiedStory = {
        ...state.stories[payload.storyId],
        title: payload.title,
        description: payload.description,
        editMode: false
      };

      return {...state, stories: {...state.stories, [payload.storyId]: modifiedStory}};

    },
    log: (username, payload) => `${username} changed story "${payload.title}"`
  },

  [EVENT_ACTION_TYPES.storyDeleted]: {
    fn: (state, payload) => {

      const modifiedStories = {...state.stories};
      delete modifiedStories[payload.storyId];

      return {
        ...state,
        stories: modifiedStories
      };

    },
    log: (username, payload) => `${username} deleted story "${payload.title}"`
  },

  /**
   * the selected story was set (i.e. the one that can be currently estimated by the team)
   */
  [EVENT_ACTION_TYPES.storySelected]: {
    fn: (state, payload) => ({...state, selectedStory: payload.storyId}),
    log: (username, payload, oldState, newState) => `${username} selected current story "${newState.stories[payload.storyId].title}"`
  },

  [EVENT_ACTION_TYPES.usernameSet]: {
    fn: (state, payload) => {

      const isOwnUser = state.userId === payload.userId;

      if (isOwnUser) {
        clientSettingsStore.setPresetUsername(payload.username);
      }

      const modifiedUsers = {
        ...state.users,
        [payload.userId]: {...state.users[payload.userId], username: payload.username}
      };
      return {...state, users: modifiedUsers, presetUsername: isOwnUser ? payload.username : state.presetUsername};
    },
    log: (username, payload, oldState) => {
      const oldUsername = oldState.users[payload.userId].username;
      if (oldUsername) {
        return `"${oldState.users[payload.userId].username}" is now called "${payload.username}"`;
      }
    }
  },

  [EVENT_ACTION_TYPES.emailSet]: {
    fn: (state, payload) => {

      const isOwnUser = state.userId === payload.userId;

      if (isOwnUser) {
        clientSettingsStore.setPresetEmail(payload.email);
      }

      return {
        ...state,
        users: {...state.users, [payload.userId]: {...state.users[payload.userId], email: payload.email}},
        presetEmail: isOwnUser ? payload.email : state.presetEmail
      };
    },
    log: (username, payload, oldState) => `${oldState.users[payload.userId].username} set his/her email address`
  },

  /**
   * visitor flag for a user was set
   */
  [EVENT_ACTION_TYPES.visitorSet]: {
    fn: (state, payload) => ({
      ...state,
      users: {...state.users, [payload.userId]: {...state.users[payload.userId], visitor: true}}
    }),
    log: username => `${username} is now visitor`
  },

  /**
   * visitor flag for a user was removed / unset
   */
  [EVENT_ACTION_TYPES.visitorUnset]: {
    fn: (state, payload) => ({
      ...state,
      users: {...state.users, [payload.userId]: {...state.users[payload.userId], visitor: false}}
    }),
    log: username => `${username} is no longer visitor`
  },

  [EVENT_ACTION_TYPES.storyEstimateGiven]: {
    fn: (state, payload) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {
          ...state.stories[payload.storyId],
          estimations: {...state.stories[payload.storyId].estimations, [payload.userId]: payload.value}
        }
      }
    })
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.storyEstimateCleared]: {
    fn: (state, payload) => {

      const modifiedEstimations = {...state.stories[payload.storyId].estimations};
      delete modifiedEstimations[payload.userId];

      return {
        ...state,
        stories: {
          ...state.stories,
          [payload.storyId]: {
            ...state.stories[payload.storyId],
            estimations: modifiedEstimations
          }
        }
      };
    }
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.revealed]: {
    fn: (state, payload) => ({
      ...state,
      stories: {...state.stories, [payload.storyId]: {...state.stories[payload.storyId], revealed: true}}
    }),
    log: (username, payload) => payload.manually ? `${username} manually revealed estimates for the current story` : 'Estimates were automatically revealed for the current story'
  },

  [EVENT_ACTION_TYPES.newEstimationRoundStarted]: {
    fn: (state, payload) => ({
      ...state,
      stories: {
        ...state.stories,
        [payload.storyId]: {...state.stories[payload.storyId], estimations: {}, revealed: false}
      }
    }),
    log: username => `${username} started a new estimation round for the current story`
  },

  [EVENT_ACTION_TYPES.commandRejected]: {
    fn: (state, payload, event) => LOGGER.error(event),
    log: (username, payload) => `An error occurred: ${payload.reason}`
  }
};

