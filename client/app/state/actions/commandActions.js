import {findNextStoryIdToEstimate} from '../estimations/estimationsSelectors';
import appConfig from '../../services/appConfig';
import uuid from '../../services/uuid';
import history from '../getBrowserHistory';
import {getOwnUserId, getOwnUserToken, getUsersPresets} from '../users/usersSelectors';
import {getSelectedStoryId} from '../stories/storiesSelectors';
import {getRoomId} from '../room/roomSelectors';

/* TYPES */
export const COMMAND_SENT = 'COMMAND_SENT';
export const LOCATION_CHANGED = 'LOCATION_CHANGED';

/* ACTION CREATORS */

/** technically these are in fact action creators, since they all dispatch a "COMMAND_SENT" action.. **/

/**
 * "location" changed in browser history (i.e. url changed).
 * send "joinRoom"  or "leaveRoom" commands if appropriate
 */
export const locationChanged = (pathname) => (dispatch, getState, sendCommand) => {
  const state = getState();
  const ourRoomId = getRoomId(state);

  if (isRoomIdGivenInPathname(pathname) && !ourRoomId) {
    joinRoom(pathname.substring(1))(dispatch, getState, sendCommand);
  } else if ((!pathname || pathname.length < 2) && getOwnUserId(state) && ourRoomId) {
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
  const state = getState();
  const ourRoomId = getRoomId(state);

  if (ourRoomId) {
    // the socket connected. since we have a roomId in our client-side state, we can assume this is a "re-connect"
    // make sure we are in sync again with the backend state. send a joinRoom command.
    joinRoom(ourRoomId)(dispatch, getState, sendCommand);
  }
};

export const joinRoom = (roomId, password) => (dispatch, getState, sendCommand) => {
  const normalizedRoomId = roomId ? roomId.toLowerCase() : uuid();

  const state = getState();

  const joinCommand = {
    name: 'joinRoom',
    roomId: normalizedRoomId,
    payload: {}
  };

  const userPresets = getUsersPresets(state);

  if (userPresets.username) {
    joinCommand.payload.username = userPresets.username;
  }
  if (userPresets.email) {
    joinCommand.payload.email = userPresets.email;
  }
  if (Number.isInteger(userPresets.avatar)) {
    joinCommand.payload.avatar = userPresets.avatar;
  }
  if (password) {
    // join with cleartext password from UI input field
    joinCommand.payload.password = password;
  } else if (getOwnUserToken(state)) {
    // join with jwt if present (after joining password-protected room, jwt is stored in our redux state)
    joinCommand.payload.token = getOwnUserToken(state);
  }

  if (userPresets.userId) {
    joinCommand.userId = userPresets.userId;
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
  if (getSelectedStoryId(state) === storyId) {
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

export const giveStoryEstimate = (value, confidence) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'giveStoryEstimate',
    payload: {
      storyId: getSelectedStoryId(state),
      value,
      confidence
    }
  });
};

export const settleEstimation = (value) => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'settleEstimation',
    payload: {
      storyId: getSelectedStoryId(state),
      value
    }
  });
};

export const clearStoryEstimate = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  sendCommand({
    name: 'clearStoryEstimate',
    payload: {
      storyId: getSelectedStoryId(state)
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

export const toggleExcluded = (userId) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'toggleExclude',
    payload: {userId}
  });
};

/* these three properties are set with "setRoomConfig" command */

export const setRoomConfigToggleAutoReveal = () => (dispatch, getState, sendCommand) => {
  const {room} = getState();
  sendCommand({
    name: 'setRoomConfig',
    payload: {
      autoReveal: !room.autoReveal,
      withConfidence: room.withConfidence,
      issueTrackingUrl: room.issueTrackingUrl
    }
  });
};

export const setRoomConfigToggleConfidence = () => (dispatch, getState, sendCommand) => {
  const {room} = getState();
  sendCommand({
    name: 'setRoomConfig',
    payload: {
      autoReveal: room.autoReveal,
      withConfidence: !room.withConfidence,
      issueTrackingUrl: room.issueTrackingUrl
    }
  });
};

export const setRoomConfigIssueTrackingUrl =
  (url = []) =>
  (dispatch, getState, sendCommand) => {
    const {room} = getState();
    sendCommand({
      name: 'setRoomConfig',
      payload: {
        autoReveal: room.autoReveal,
        withConfidence: room.withConfidence,
        issueTrackingUrl: url
      }
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

export const trashStories = (storyIds) => (dispatch, getState, sendCommand) => {
  storyIds.forEach((id) =>
    sendCommand({
      name: 'trashStory',
      payload: {
        storyId: id
      }
    })
  );
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

export const setCardConfig =
  (cardConfig = []) =>
  (dispatch, getState, sendCommand) => {
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
