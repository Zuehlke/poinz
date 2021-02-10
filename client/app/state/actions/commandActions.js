import {v4 as uuid} from 'uuid';

import {findNextStoryIdToEstimate} from '../selectors/storiesAndEstimates';
import appConfig from '../../services/appConfig';
import history from '../getBrowserHistory';

/* TYPES */
export const COMMAND_SENT = 'COMMAND_SENT';
export const LOCATION_CHANGED = 'LOCATION_CHANGED';

/* ACTION CREATORS */

/** technically these are in fact action creators, since they all dispatch a "COMMAND_SENT" action.. **/

/**
 * Store current pathname in our redux store, join or leave room if necessary
 */
export const locationChanged = (pathname) => (dispatch, getState, sendCommand) => {
  const state = getState();

  if (isRoomIdGivenInPathname(pathname) && !state.roomId) {
    joinRoom(pathname.substring(1))(dispatch, getState, sendCommand);
  } else if (!pathname || (pathname.length < 2 && state.userId && state.roomId)) {
    sendCommand({
      name: 'leaveRoom',
      payload: {}
    });
  }

  dispatch({
    type: LOCATION_CHANGED,
    pathname
  });
};
const isRoomIdGivenInPathname = (pathname) =>
  pathname && pathname.length > 1 && pathname.substring(1) !== appConfig.APP_STATUS_IDENTIFIER;

export const onSocketConnect = () => (dispatch, getState, sendCommand) => {
  const roomId = getState().roomId;

  if (roomId) {
    // the socket connected. since we have a roomId in our client-side state, we can assume this is a "re-connect"
    // make sure we are in sync again with the backend state. send a joinRoom command.
    joinRoom(roomId)(dispatch, getState, sendCommand);
  }
};

export const joinRoom = (roomId, password) => (dispatch, getState, sendCommand) => {
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
  if (password) {
    // join with cleartext password from UI input field
    joinCommandPayload.password = password;
  } else if (state.userToken) {
    // join with jwt if present (after joining password-protected room, jwt is stored in our redux state)
    joinCommandPayload.token = state.userToken;
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

/*
 * technically not a "commandAction". but fits best in this file.
 */
export const leaveRoom = () => () => {
  // we only need to navigate to the landing page
  // locationChanged will trigger sending "leaveRoom" command to backend
  history.push('/');
};

export const addStory = (storyTitle, storyDescription) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'addStory',
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
      payload: {
        storyId: nextStoryId
      }
    });
  }
};

export const giveStoryEstimate = (value) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'giveStoryEstimate',
    payload: {
      storyId: state.selectedStory,
      value
    }
  });
};

export const clearStoryEstimate = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'clearStoryEstimate',
    payload: {
      storyId: state.selectedStory
    }
  });
};

export const newEstimationRound = (storyId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'newEstimationRound',
    payload: {
      storyId: storyId
    }
  });
};

export const reveal = (storyId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'reveal',
    payload: {
      storyId: storyId
    }
  });
};

export const setUsername = (username) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setUsername',
    payload: {
      username: username
    }
  });
};

export const setEmail = (email) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setEmail',
    payload: {
      email: email
    }
  });
};

export const setAvatar = (avatar) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setAvatar',
    payload: {
      avatar
    }
  });
};

export const toggleExcluded = () => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'toggleExclude',
    payload: {}
  });
};

export const toggleAutoReveal = () => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'toggleAutoReveal',
    payload: {}
  });
};

export const kick = (userId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'kick',
    payload: {
      userId
    }
  });
};

export const changeStory = (storyId, title, description) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'changeStory',
    payload: {
      storyId,
      title,
      description
    }
  });
};

export const trashStory = (storyId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'trashStory',
    payload: {
      storyId
    }
  });
};

export const restoreStory = (storyId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'restoreStory',
    payload: {
      storyId
    }
  });
};

export const deleteStory = (storyId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'deleteStory',
    payload: {
      storyId
    }
  });
};

export const setCardConfig = (cardConfig) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setCardConfig',
    payload: {
      cardConfig
    }
  });
};

export const setPassword = (password) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setPassword',
    payload: {
      password
    }
  });
};

export const importCsvFile = (file) => (dispatch, getState, sendCommand) => {
  readDroppedFile(file).then((content) => {
    sendCommand({
      name: 'importStories',
      payload: {
        data: content
      }
    });
  });
};

function readDroppedFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = () => reject('aborted');
    reader.onerror = () => reject('error');
    reader.onload = () => resolve(reader.result);

    reader.readAsDataURL(file);
  });
}
