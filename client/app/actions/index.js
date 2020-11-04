import {v4 as uuid} from 'uuid';
import axios from 'axios';
import log from 'loglevel';

import history from '../services/getBrowserHistory';
import appConfig from '../services/appConfig';

import {
  LOCATION_CHANGED,
  TOGGLE_BACKLOG,
  TOGGLE_SIDEBAR,
  EDIT_STORY,
  HIGHLIGHT_STORY,
  CANCEL_EDIT_STORY,
  STATUS_FETCHED,
  SET_LANGUAGE,
  EVENT_RECEIVED,
  EVENT_ACTION_TYPES,
  HIDE_NEW_USER_HINTS,
  SHOW_TRASH,
  HIDE_TRASH,
  TOGGLE_MARK_FOR_KICK,
  ROOM_STATE_FETCHED
} from './types';
import clientSettingsStore from '../store/clientSettingsStore';
import readDroppedFile from '../services/readDroppedFile';
import findNextStoryIdToEstimate from '../services/findNextStoryIdToEstimate';

/**
 * Store current pathname in our redux store, join or leave room if necessary
 */
export const locationChanged = (pathname) => (dispatch, getState, sendCommand) => {
  const state = getState();

  if (
    pathname &&
    pathname.length > 1 &&
    pathname.substring(1) !== appConfig.APP_STATUS_IDENTIFIER &&
    !state.roomId
  ) {
    joinRoom(pathname.substring(1))(dispatch, getState, sendCommand);
  } else if (!pathname || (pathname.length < 2 && state.userId && state.roomId)) {
    sendCommand({
      name: 'leaveRoom',
      roomId: state.roomId,
      payload: {}
    });
  }

  dispatch({
    type: LOCATION_CHANGED,
    pathname
  });
};

export const onSocketConnect = () => (dispatch, getState, sendCommand) => {
  const roomId = getState().roomId;

  if (roomId) {
    // the socket connected. since we have a roomId in our client-side state, we can assume this is a "re-connect"
    // make sure we are in sync again with the backend state. send a joinRoom command.
    joinRoom(roomId)(dispatch, getState, sendCommand);
  }
};

/**
 *
 * @param event
 */
export const eventReceived = (event) => (dispatch, getState) => {
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

  if (matchingType === EVENT_ACTION_TYPES.commandRejected) {
    tryToRecoverOnRejection(event, dispatch, getState);
  }
};

/**
 * Our actions contain our client-side business logic. (when to send which command).
 * They produce commands and pass them to the hub for sending.
 */

export const joinRoom = (roomId) => (dispatch, getState, sendCommand) => {
  const normalizedRoomId = roomId ? roomId.toLowerCase() : uuid();

  const joinCommandPayload = {};
  const state = getState();

  if (state.presetUsername) {
    joinCommandPayload.username = state.presetUsername;
  }
  if (state.presetEmail) {
    joinCommandPayload.email = state.presetEmail;
  }
  if (Number.isInteger(state.presetAvatar)) {
    joinCommandPayload.avatar = state.presetAvatar;
  }

  const joinCommand = {
    name: 'joinRoom',
    roomId: normalizedRoomId,
    payload: joinCommandPayload
  };

  if (state.presetUserId) {
    joinCommand.userId = state.presetUserId;
  }

  sendCommand(joinCommand);
};

export const addStory = (storyTitle, storyDescription) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'addStory',
    roomId: state.roomId,
    payload: {
      title: storyTitle,
      description: storyDescription
    }
  });
};

export const selectStory = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  if (state.selectedStory === storyId) {
    return;
  }

  sendCommand({
    name: 'selectStory',
    roomId: state.roomId,
    payload: {
      storyId
    }
  });
};

export const selectNextStory = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  const nextStoryId = findNextStoryIdToEstimate(state);

  if (nextStoryId) {
    sendCommand({
      name: 'selectStory',
      roomId: state.roomId,
      payload: {
        storyId: nextStoryId
      }
    });
  }
};

export const giveStoryEstimate = (storyId, value) => (dispatch, getState, sendCommand) => {
  const state = getState();

  const command = {
    roomId: state.roomId,
    payload: {
      value: value,
      storyId: storyId
    }
  };

  if (
    state.estimations &&
    state.estimations[storyId] &&
    state.estimations[storyId][state.userId] === value
  ) {
    command.name = 'clearStoryEstimate';
    delete command.payload.value;
  } else {
    command.name = 'giveStoryEstimate';
  }

  sendCommand(command);
};

export const newEstimationRound = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'newEstimationRound',
    roomId: state.roomId,
    payload: {
      storyId: storyId
    }
  });
};

export const reveal = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'reveal',
    roomId: state.roomId,
    payload: {
      storyId: storyId
    }
  });
};

export const setUsername = (username) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'setUsername',
    roomId: state.roomId,
    payload: {
      username: username
    }
  });
};

export const setEmail = (email) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'setEmail',
    roomId: state.roomId,
    payload: {
      email: email
    }
  });
};

export const setAvatar = (avatar) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'setAvatar',
    roomId: state.roomId,
    payload: {
      avatar
    }
  });
};

export const toggleExcluded = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'toggleExclude',
    roomId: state.roomId,
    payload: {}
  });
};

export const toggleAutoReveal = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'toggleAutoReveal',
    roomId: state.roomId,
    payload: {}
  });
};

export const kick = (userId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'kick',
    roomId: state.roomId,
    payload: {
      userId
    }
  });
};

export const leaveRoom = () => () => {
  // we only need to navigate to the landing page
  // locationChanged will trigger sending "leaveRoom" command to backend
  history.push('/');
};

export const changeStory = (storyId, title, description) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'changeStory',
    roomId: state.roomId,
    payload: {
      storyId,
      title,
      description
    }
  });
};

export const trashStory = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'trashStory',
    roomId: state.roomId,
    payload: {
      storyId
    }
  });
};

export const restoreStory = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'restoreStory',
    roomId: state.roomId,
    payload: {
      storyId
    }
  });
};

export const deleteStory = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'deleteStory',
    roomId: state.roomId,
    payload: {
      storyId
    }
  });
};

export const setCardConfig = (cardConfig) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'setCardConfig',
    roomId: state.roomId,
    payload: {
      cardConfig
    }
  });
};

export const importCsvFile = (file) => (dispatch, getState, sendCommand) => {
  readDroppedFile(file).then((content) => {
    const state = getState();
    sendCommand({
      name: 'importStories',
      roomId: state.roomId,
      payload: {
        data: content
      }
    });
  });
};

export const fetchStatus = () => (dispatch) => {
  axios.get('/api/status').then((response) => {
    dispatch({
      type: STATUS_FETCHED,
      status: response.data
    });
  });
};

/**
 * If a command failed, the server sends a "commandRejected" event.
 * From some rejections, we might be able to recover by reloading the room state from the backend.
 * Obviously there are situations where there is a mismatch between server and client state.
 */
const tryToRecoverOnRejection = (event, dispatch, getState) => {
  if (!event.payload || !event.payload.command) {
    return;
  }

  const failedCommandName = event.payload.command.name;

  if (
    failedCommandName === 'giveStoryEstimate' ||
    failedCommandName === 'clearStoryEstimate' ||
    failedCommandName === 'newEstimationRound' ||
    failedCommandName === 'reveal'
  ) {
    fetchCurrentRoom(dispatch, getState);
  }
};

const fetchCurrentRoom = (dispatch, getState) => {
  const state = getState();

  if (!state.roomId) {
    return;
  }

  axios.get('/api/room/' + state.roomId).then((response) => {
    dispatch({
      type: ROOM_STATE_FETCHED,
      room: response.data
    });
  });
};

// ui-only actions (client-side view state)
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const showTrash = () => ({type: SHOW_TRASH});
export const hideTrash = () => ({type: HIDE_TRASH});
export const highlightStory = (storyId) => ({type: HIGHLIGHT_STORY, storyId});
export const editStory = (storyId) => ({type: EDIT_STORY, storyId});
export const cancelEditStory = (storyId) => ({type: CANCEL_EDIT_STORY, storyId});
export const toggleMarkForKick = (userId) => ({type: TOGGLE_MARK_FOR_KICK, userId});
export const setLanguage = (language) => {
  clientSettingsStore.setPresetLanguage(language);
  return {type: SET_LANGUAGE, language};
};
export const hideNewUserHints = () => {
  clientSettingsStore.setHideNewUserHints(true);
  return {type: HIDE_NEW_USER_HINTS};
};

export const toggleSidebar = (sidebarKey) => ({type: TOGGLE_SIDEBAR, sidebarKey});
export const SIDEBAR_HELP = 'HELP';
export const SIDEBAR_SETTINGS = 'SETTINGS';
export const SIDEBAR_ACTIONLOG = 'ACTIONLOG';
