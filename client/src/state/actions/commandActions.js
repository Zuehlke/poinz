import {findNextStoryIdToEstimate} from '../estimations/estimationsSelectors';
import appConfig from '../../services/appConfig';
import history from '../getBrowserHistory';
import {getOwnUserId, getOwnUserToken} from '../users/usersSelectors';
import {getSelectedStoryId} from '../stories/storiesSelectors';
import {getRoomId} from '../room/roomSelectors';
import {getJoinRoomId, getJoinUserdata} from '../joining/joiningSelectors';
import {
  trackRoomSettingsChanged,
  trackStoryCreated,
  trackStoryEdited,
  trackStoryTrashed,
  trackStoryRestored,
  trackNewEstimationRound
} from '../../services/tracking';

/* TYPES */
export const COMMAND_SENT = 'COMMAND_SENT';
export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const JOIN_PROPERTIES_ADDED = 'JOIN_PROPERTIES_ADDED';

/* ACTION CREATORS */

/**
 * this is were we send different commands to the backend.
 * these are in fact action creators, since they all dispatch a "COMMAND_SENT" action..
 */

/**
 * We collect join-information (preset userId, preset Email, roomId, username) from the user in different views in the app.
 * From all these points, we can call {@link joinIfReady} and pass the properties we already have so far.
 *
 * @param {object} joinProps
 */
export const joinIfReady = (joinProps) => (dispatch, getState, sendCommand) => {
  const state = getState();
  const roomId = joinProps.roomId ? joinProps.roomId.toLowerCase() : getJoinRoomId(state);
  delete joinProps.roomId;

  const joinUserdata = {
    ...getJoinUserdata(state),
    ...joinProps
  };

  dispatch({
    type: JOIN_PROPERTIES_ADDED,
    properties: joinUserdata,
    roomId
  });

  if (joinUserdata.username && roomId) {
    // if we have the two mandatory properties, we can join
    joinRoom(roomId, joinUserdata, sendCommand);
  }
};

/**
 * "location" changed in browser history.
 * - send "joinRoom" if path contains a roomId, but we have no room in state yet
 * - if we have a room in state but path is empty (landing page), send "leaveRoom"
 */
export const locationChanged = (pathname) => (dispatch, getState, sendCommand) => {
  const state = getState();
  const ourRoomId = getRoomId(state);

  if (!ourRoomId && isRoomIdGivenInPathname(pathname)) {
    joinIfReady({roomId: pathname.substring(1)})(dispatch, getState, sendCommand);
  } else if (ourRoomId && isEmptyPathname(pathname) && getOwnUserId(state)) {
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
  pathname?.length > 1 && pathname.substring(1) !== appConfig.APP_STATUS_IDENTIFIER;
const isEmptyPathname = (pathname) => !pathname || pathname.length < 2;

export const onSocketConnect = () => (dispatch, getState, sendCommand) => {
  const state = getState();
  const ourRoomId = getRoomId(state);

  if (ourRoomId) {
    // the socket connected. since we have a roomId in our client-side state, we can assume this is a "re-connect"
    // make sure we are in sync again with the backend state. send a joinRoom command.
    joinIfReady({roomId: ourRoomId, token: getOwnUserToken(state)})(
      dispatch,
      getState,
      sendCommand
    );
  }
};

const joinRoom = (roomId, userdata, sendCommand) => {
  const joinCommand = {
    name: 'joinRoom',
    roomId,
    payload: {
      username: userdata.username // only payload prop that is mandatory
    }
  };

  if (userdata.userId) {
    joinCommand.userId = userdata.userId;
  }
  if (userdata.email) {
    joinCommand.payload.email = userdata.email;
  }
  if (userdata.avatar) {
    joinCommand.payload.avatar = userdata.avatar;
  }
  if (userdata.password) {
    joinCommand.payload.password = userdata.password;
  }
  if (userdata.token) {
    joinCommand.payload.token = userdata.token;
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

export const addStory = (title, description = '') => (dispatch, getState, sendCommand) => {
  const hasDescription = description.length > 0;
  
  trackStoryCreated({
    roomId: getRoomId(getState()),
    hasDescription,
    descriptionLength: description.length
  });

  sendCommand({
    name: 'addStory',
    payload: {
      title,
      description
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

export const settleEstimation = (storyId, value) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'settleEstimation',
    payload: {
      storyId,
      value
    }
  });
};

export const setStoryValue = (storyId, value) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setStoryValue',
    payload: {
      storyId,
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
  trackNewEstimationRound({
    roomId: getRoomId(getState())
  });

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
  const newAutoReveal = !room.autoReveal;
  
  trackRoomSettingsChanged({
    roomId: room.roomId,
    setting: 'autoReveal',
    newValue: newAutoReveal
  });
  
  sendCommand({
    name: 'setRoomConfig',
    payload: {
      autoReveal: newAutoReveal,
      withConfidence: room.withConfidence,
      issueTrackingUrl: room.issueTrackingUrl
    }
  });
};

export const setRoomConfigToggleConfidence = () => (dispatch, getState, sendCommand) => {
  const {room} = getState();
  const newWithConfidence = !room.withConfidence;
  
  trackRoomSettingsChanged({
    roomId: room.roomId,
    setting: 'confidence',
    newValue: newWithConfidence
  });
  
  sendCommand({
    name: 'setRoomConfig',
    payload: {
      autoReveal: room.autoReveal,
      withConfidence: newWithConfidence,
      issueTrackingUrl: room.issueTrackingUrl
    }
  });
};

export const setRoomConfigIssueTrackingUrl = (url = '') => (dispatch, getState, sendCommand) => {
  const {room} = getState();
  
  trackRoomSettingsChanged({
    roomId: room.roomId,
    setting: 'issueTracking',
    newValue: url
  });
  
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

export const changeStory = (storyId, title, description = '') => (dispatch, getState, sendCommand) => {
  const state = getState();
  const story = state.stories.storiesById[storyId];
  const titleChanged = story.title !== title;
  const descriptionChanged = story.description !== description;
  
  trackStoryEdited({
    roomId: getRoomId(state),
    storyId,
    fieldChanged: titleChanged && descriptionChanged ? 'both' : titleChanged ? 'title' : 'description'
  });

  sendCommand({
    name: 'changeStory',
    payload: {
      storyId,
      title,
      description
    }
  });
};

export const setSortOrder = (storyIds) => (dispatch, getState, sendCommand) => {
  sendCommand({
    name: 'setSortOrder',
    payload: {
      sortOrder: storyIds
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
  const state = getState();
  const story = state.stories.storiesById[storyId];
  
  trackStoryTrashed({
    roomId: getRoomId(state),
    storyId,
    hadConsensus: !!story.consensus,
    storyLifetimeMinutes: Math.floor((Date.now() - story.createdAt) / 60000)
  });

  sendCommand({
    name: 'trashStory',
    payload: {
      storyId
    }
  });
};

export const restoreStory = (storyId) => (dispatch, getState, sendCommand) => {
  const state = getState();
  const story = state.stories.storiesById[storyId];
  
  trackStoryRestored({
    roomId: getRoomId(state),
    storyId,
    timeInTrashMinutes: Math.floor((Date.now() - story.trashedAt) / 60000)
  });

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
