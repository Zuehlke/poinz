import axios from 'axios';
import createHistory from 'history/createBrowserHistory';
import hub from '../services/hub';

import {
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  TOGGLE_LOG,
  EDIT_STORY,
  CANCEL_EDIT_STORY,
  SET_ROOMID,
  STATUS_FETCHED,
  SET_LANGUAGE
} from '../actions/types';

let history = createHistory();

/**
 * Our actions contain our client-side business logic. (when to send which command).
 * They produce commands and pass them to the hub for sending.
 */

export const joinRoom = roomId => (dispatch, getState) => {
  const normalizedRoomId = roomId.toLowerCase();
  history.push({
    pathname: `/${normalizedRoomId}`
  });

  const joinCommandPayload = {};
  const state = getState();

  if (state.get('presetUserId')) {
    joinCommandPayload.userId = state.get('presetUserId');
  }
  if (state.get('presetUsername')) {
    joinCommandPayload.username = state.get('presetUsername');
  }
  if (state.get('presetEmail')) {
    joinCommandPayload.email = state.get('presetEmail');
  }

  /**
   * "prematurely" set the room id to the client state ( see root reducer )
   * so that first incoming "joined" event is not filtered out.
   *
   * this is a client-only redux action
   */
  dispatch({
    type: SET_ROOMID,
    roomId: normalizedRoomId
  });

  hub.sendCommand({
    name: 'joinRoom',
    roomId: normalizedRoomId,
    payload: joinCommandPayload
  }, dispatch);
};

export const addStory = (storyTitle, storyDescription) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'addStory',
    roomId: state.get('roomId'),
    payload: {
      title: storyTitle,
      description: storyDescription
    }
  }, dispatch);
};

export const selectStory = storyId => (dispatch, getState) => {
  const state = getState();
  if (state.get('selectedStory') === storyId) {
    return;
  }

  hub.sendCommand({
    name: 'selectStory',
    roomId: state.get('roomId'),
    payload: {
      storyId
    }
  }, dispatch);
};

export const giveStoryEstimate = (storyId, value) => (dispatch, getState)=> {
  const state = getState();

  const command = {
    roomId: state.get('roomId'),
    payload: {
      value: value,
      userId: state.get('userId'),
      storyId: storyId
    }
  };

  if (state.getIn(['stories', storyId, 'estimations', state.get('userId')]) === value) {
    command.name = 'clearStoryEstimate';
  } else {
    command.name = 'giveStoryEstimate';
    command.payload.value = value;
  }

  hub.sendCommand(command, dispatch);
};

export const newEstimationRound = storyId => (dispatch, getState)=> {
  const state = getState();
  hub.sendCommand({
    name: 'newEstimationRound',
    roomId: state.get('roomId'),
    payload: {
      storyId: storyId
    }
  }, dispatch);
};

export const reveal = storyId => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'reveal',
    roomId: state.get('roomId'),
    payload: {
      storyId: storyId
    }
  }, dispatch);
};

export const setUsername = username => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'setUsername',
    roomId: state.get('roomId'),
    payload: {
      userId: state.get('userId'),
      username: username
    }
  }, dispatch);
};

export const setEmail = email => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'setEmail',
    roomId: state.get('roomId'),
    payload: {
      userId: state.get('userId'),
      email: email
    }
  }, dispatch);
};

export const setVisitor = isVisitor => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'setVisitor',
    roomId: state.get('roomId'),
    payload: {
      isVisitor,
      userId: state.get('userId')
    }
  }, dispatch);
};

export const kick = userId => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'kick',
    roomId: state.get('roomId'),
    payload: {
      userId
    }
  }, dispatch);
};

export const leaveRoom = () => (dispatch, getState) => {
  history.push({
    pathname: ''
  });
  const state = getState();
  hub.sendCommand({
    name: 'leaveRoom',
    roomId: state.get('roomId'),
    payload: {
      userId: state.get('userId')
    }
  }, dispatch);
};

export const changeStory = (storyId, title, description) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'changeStory',
    roomId: state.get('roomId'),
    payload: {
      storyId,
      title,
      description
    }
  }, dispatch);
};

export const deleteStory = (storyId, title) => (dispatch, getState) => {
  const state = getState();
  hub.sendCommand({
    name: 'deleteStory',
    roomId: state.get('roomId'),
    payload: {
      storyId,
      title
    }
  }, dispatch);
};

export const fetchStatus = () => dispatch => {
  axios.get('/api/status')
    .then(response => {
      dispatch({
        type: STATUS_FETCHED,
        status: response.data
      });
    });
};

// ui-only actions (client-side view state)
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const toggleUserMenu = () => ({type: TOGGLE_USER_MENU});
export const toggleLog = () => ({type: TOGGLE_LOG});
export const editStory = storyId => ({type: EDIT_STORY, storyId});
export const cancelEditStory = storyId => ({type: CANCEL_EDIT_STORY, storyId});
export const setLanguage = language => ({type: SET_LANGUAGE, language});

