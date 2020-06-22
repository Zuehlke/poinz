import {v4 as uuid} from 'uuid';
import axios from 'axios';
import log from 'loglevel';

import hub from '../services/hub';
import history from '../services/getBrowserHistory';
import appConfig from '../services/appConfig';

import {
  LOCATION_CHANGED,
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  TOGGLE_LOG,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  STATUS_FETCHED,
  SET_LANGUAGE,
  EVENT_RECEIVED,
  EVENT_ACTION_TYPES,
  HIDE_NEW_USER_HINTS,
  SHOW_TRASH,
  HIDE_TRASH
} from './types';
import clientSettingsStore from '../store/clientSettingsStore';

/**
 * store current pathname in our redux store, join or leave room if necessary
 */
export const locationChanged = (pathname) => (dispatch, getState) => {
  const state = getState();

  if (
    pathname &&
    pathname.length > 1 &&
    pathname.substring(1) !== appConfig.APP_STATUS_IDENTIFIER &&
    !state.roomId
  ) {
    joinRoom(pathname.substring(1))(dispatch, getState);
  } else if (!pathname || (pathname.length < 2 && state.userId && state.roomId)) {
    hub.sendCommand(
      {
        name: 'leaveRoom',
        roomId: state.roomId,
        payload: {}
      },
      dispatch
    );
  }

  dispatch({
    type: LOCATION_CHANGED,
    pathname
  });
};

/**
 *
 * @param event
 */
export const eventReceived = (event) => (dispatch) => {
  const matchingType = EVENT_ACTION_TYPES[event.name];
  if (!matchingType) {
    log.error(`Unknown incoming event type ${event.name}. Will not dispatch a specific action.`);
    return;
  }

  // dispatch generic "event_received" action
  dispatch({
    type: EVENT_RECEIVED,
    eventName: event.name,
    correlationId: event.correlationId
  });

  // dispatch the specific event action
  dispatch({
    event,
    type: matchingType
  });

  if (event.name === 'joinedRoom') {
    history.push('/' + event.roomId);
  }
};

/**
 * Our actions contain our client-side business logic. (when to send which command).
 * They produce commands and pass them to the hub for sending.
 */

export const joinRoom = (roomId) => (dispatch, getState) => {
  const normalizedRoomId = roomId ? roomId.toLowerCase() : uuid();

  const joinCommandPayload = {};
  const state = getState();

  if (state.presetUserId) {
    joinCommandPayload.userId = state.presetUserId;
  }
  if (state.presetUsername) {
    joinCommandPayload.username = state.presetUsername;
  }
  if (state.presetEmail) {
    joinCommandPayload.email = state.presetEmail;
  }
  if (state.presetAvatar) {
    joinCommandPayload.avatar = state.presetAvatar;
  }

  hub.sendCommand(
    {
      name: 'joinRoom',
      roomId: normalizedRoomId,
      payload: joinCommandPayload
    },
    dispatch
  );
};

export const addStory = (storyTitle, storyDescription) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'addStory',
      roomId: state.roomId,
      payload: {
        title: storyTitle,
        description: storyDescription
      }
    },
    dispatch
  );
};

export const selectStory = (storyId) => (dispatch, getState) => {
  const state = getState();
  if (state.selectedStory === storyId) {
    return;
  }

  hub.sendCommand(
    {
      name: 'selectStory',
      roomId: state.roomId,
      payload: {
        storyId
      }
    },
    dispatch
  );
};

export const giveStoryEstimate = (storyId, value) => (dispatch, getState) => {
  const state = getState();

  const command = {
    roomId: state.roomId,
    payload: {
      value: value,
      storyId: storyId
    }
  };

  if (state.stories[storyId] && state.stories[storyId].estimations[state.userId] === value) {
    command.name = 'clearStoryEstimate';
    delete command.payload.value;
  } else {
    command.name = 'giveStoryEstimate';
  }

  hub.sendCommand(command, dispatch);
};

export const newEstimationRound = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'newEstimationRound',
      roomId: state.roomId,
      payload: {
        storyId: storyId
      }
    },
    dispatch
  );
};

export const reveal = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'reveal',
      roomId: state.roomId,
      payload: {
        storyId: storyId
      }
    },
    dispatch
  );
};

export const setUsername = (username) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setUsername',
      roomId: state.roomId,
      payload: {
        username: username
      }
    },
    dispatch
  );
};

export const setEmail = (email) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setEmail',
      roomId: state.roomId,
      payload: {
        email: email
      }
    },
    dispatch
  );
};

export const setAvatar = (avatar) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'setAvatar',
      roomId: state.roomId,
      payload: {
        avatar
      }
    },
    dispatch
  );
};

export const toggleExcluded = () => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'toggleExclude',
      roomId: state.roomId,
      payload: {}
    },
    dispatch
  );
};

export const kick = (userId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'kick',
      roomId: state.roomId,
      payload: {
        userId
      }
    },
    dispatch
  );
};

export const leaveRoom = () => () => {
  // we only need to navigate to the landing page
  // locationChanged will trigger sending "leaveRoom" command to backend
  history.push('/');
};

export const changeStory = (storyId, title, description) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'changeStory',
      roomId: state.roomId,
      payload: {
        storyId,
        title,
        description
      }
    },
    dispatch
  );
};

export const trashStory = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'trashStory',
      roomId: state.roomId,
      payload: {
        storyId
      }
    },
    dispatch
  );
};

export const restoreStory = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'restoreStory',
      roomId: state.roomId,
      payload: {
        storyId
      }
    },
    dispatch
  );
};

export const deleteStory = (storyId) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand(
    {
      name: 'deleteStory',
      roomId: state.roomId,
      payload: {
        storyId
      }
    },
    dispatch
  );
};

export const fetchStatus = () => (dispatch) => {
  axios.get('/api/status').then((response) => {
    dispatch({
      type: STATUS_FETCHED,
      status: response.data
    });
  });
};

// ui-only actions (client-side view state)
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const showTrash = () => ({type: SHOW_TRASH});
export const hideTrash = () => ({type: HIDE_TRASH});
export const toggleUserMenu = () => ({type: TOGGLE_USER_MENU});
export const toggleLog = () => ({type: TOGGLE_LOG});
export const editStory = (storyId) => ({type: EDIT_STORY, storyId});
export const cancelEditStory = (storyId) => ({type: CANCEL_EDIT_STORY, storyId});
export const setLanguage = (language) => {
  clientSettingsStore.setPresetLanguage(language);
  return {type: SET_LANGUAGE, language};
};
export const hideNewUserHints = () => {
  clientSettingsStore.setHideNewUserHints(true);
  return {type: HIDE_NEW_USER_HINTS};
};
