import log from 'loglevel';
import Immutable from 'immutable';
import { EVENT_ACTION_TYPES } from './actionTypes';
import clientSettingsStore from './clientSettingsStore';

const LOGGER = log.getLogger('eventReducer');

function eventReducer(state, action) {

  const { event } = action;

  // currently, events from other rooms do not affect us (backend should not send such events in the first place)
  // so we do not modify our client-side state in any way
  if (state.get('roomId') !== event.roomId) {
    LOGGER.warn(`Event with different roomId received. localRoomId=${state.get('roomId')}, eventRoomId=${event.roomId} (${event.name})`);
    return state;
  }

  const matchingHandler = eventActionHandlers[action.type];
  if (matchingHandler) {
    let modifiedState = matchingHandler.fn(state, event.payload, event) || state;
    modifiedState = updateActionLog(matchingHandler.log, state, modifiedState, event);
    return modifiedState;
  } else {
    LOGGER.warn('unknown event action', action);
    return state;
  }
}

/**
 * adds a log message for a backend event to the state.
 *
 * @param {undefined | string | function} logObject defined in event handlers. If this is a function, username, eventPayload, oldState and newState will be passed.
 * @param {Immutable.Map} oldState The state before the action was reduced
 * @param {Immutable.Map}  modifiedState The state after the action was reduced
 * @param {object} event
 * @returns {Immutable.Map} The new state containing updated actionLog
 */
function updateActionLog(logObject, oldState, modifiedState, event) {
  if (!logObject) {
    return modifiedState;
  }

  const matchingUser = modifiedState.getIn(['users', event.userId]);
  const username = matchingUser ? matchingUser.get('username') || '' : '';
  const message = (typeof logObject === 'function') ? logObject(username, event.payload, oldState, modifiedState) : logObject;
  return modifiedState.update('actionLog', new Immutable.List(), log => log.push(new Immutable.Map({
    tstamp: new Date(),
    message
  })));

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
  [EVENT_ACTION_TYPES.roomCreated]: {
    fn: (state) => state,
    log: (username, payload) => `Room "${payload.id}" created`
  },

  [EVENT_ACTION_TYPES.joinedRoom]: {
    fn: (state, payload, event) => {
      if (state.get('userId')) {
        // someone else joined
        return state.setIn(['users', payload.userId], Immutable.fromJS(payload.users[payload.userId]));
      } else {
        // you joined

        // set the page title
        document.title = `PoinZ - ${event.roomId}`;

        clientSettingsStore.setPresetUserId(payload.userId);

        // server sends current room state (users, stories, etc.)
        return state
          .set('waitingForJoin', false)
          .set('roomId', event.roomId)
          .set('userId', payload.userId)
          .set('selectedStory', payload.selectedStory)
          .set('users', Immutable.fromJS(payload.users || {}))
          .set('stories', Immutable.fromJS(payload.stories || {}));

      }
    },
    log: (username, payload, oldState, newState) => {
      return (oldState.get('userId')) ? `User ${username} joined` : `You joined room "${newState.get('roomId')}"`;
    }
  },

  [EVENT_ACTION_TYPES.leftRoom]: {
    fn: (state, payload) => {

      const isOwnUser = state.get('userId') === payload.userId;

      if (isOwnUser) {
        // you (or you in another browser) left the room

        // set the page title
        document.title = 'PoinZ';

        // let's clear some state
        return state
          .remove('userId')
          .remove('roomId')
          .remove('stories')
          .remove('users')
          .remove('selectedStory')
          .remove('userMenuShown')
          .remove('backlogShown')
          .set('actionLog', new Immutable.List());

      } else {
        // someone else left the room
        return state
          .update('stories', stories => stories.map(story => story.removeIn(['estimations', payload.userId])))  // remove leaving user's estimations from all stories
          .removeIn(['users', payload.userId]); // then remove user from room
      }
    },
    log: (username, payload, oldState) => `User ${oldState.getIn(['users', payload.userId]).get('username')} left the room`
  },

  [EVENT_ACTION_TYPES.connectionLost]: {
    fn: (state, payload) => state.updateIn(['users', payload.userId], user => user.set('disconnected', true)),
    log: (username) =>`${username} lost the connection`
  },

  [EVENT_ACTION_TYPES.storyAdded]: {
    fn: (state, payload) => {
      const newStory = Immutable.fromJS(payload);
      return state.update('stories', stories => stories.set(payload.id, newStory));
    },
    log: (username, payload) => `${username} added new story "${payload.title}"`
  },

  [EVENT_ACTION_TYPES.storySelected]: {
    fn: (state, payload) => state.set('selectedStory', payload.storyId),
    log: (username, payload, oldState, newState) => `${username} selected current story "${newState.getIn(['stories', payload.storyId]).get('title')}"`
  },

  [EVENT_ACTION_TYPES.usernameSet]: {
    fn: (state, payload) => {
      if (payload.userId === state.get('userId')) {
        clientSettingsStore.setPresetUsername(payload.username);
      }
      return state.updateIn(['users', payload.userId], user => user.set('username', payload.username));
    },
    log: (username, payload, oldState) => `${oldState.getIn(['users', payload.userId]).get('username')} is now called "${payload.username}"`
  },

  [EVENT_ACTION_TYPES.visitorSet]: {
    fn: (state, payload) => state.updateIn(['users', payload.userId], person => person.set('visitor', true)),
    log: username => `${username} is now visitor`
  },

  [EVENT_ACTION_TYPES.visitorUnset]: {
    fn: (state, payload) => state.updateIn(['users', payload.userId], person => person.set('visitor', false)),
    log: username => `${username} is no longer visitor`
  },

  [EVENT_ACTION_TYPES.storyEstimateGiven]: {
    fn: (state, payload) => state.setIn(['stories', payload.storyId, 'estimations', payload.userId], payload.value)
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.storyEstimateCleared]: {
    fn: (state, payload) => state.removeIn(['stories', payload.storyId, 'estimations', payload.userId])
    // do not log -> if user is uncertain and switches between cards -> gives hints to other colleagues
  },

  [EVENT_ACTION_TYPES.revealed]: {
    fn: (state, payload) => state.setIn(['stories', payload.storyId, 'revealed'], true),
    log: (username, payload) => payload.manually ? `${username} manually revealed estimates for the current story` : 'Estimates were automatically revealed for the current story'
  },

  [EVENT_ACTION_TYPES.newEstimationRoundStarted]: {
    fn: (state, payload) => state
      .setIn(['stories', payload.storyId, 'estimations'], new Immutable.Map())
      .setIn(['stories', payload.storyId, 'revealed'], false),
    log: username => `${username} started a new estimation round for the current story`
  },

  [EVENT_ACTION_TYPES.commandRejected]: {
    fn: (state, payload, event) => LOGGER.error(event),
    log: (username, payload) => `An error occurred: ${JSON.stringify(payload)}`
  }
};

export default eventReducer;
