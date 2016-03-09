import { createHistory } from 'history';
import hub from './hub';

import {
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU,
  SET_ROOMID
} from './actionTypes';

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

  /**
   * "prematurely" set the room id ( see root reducer )
   * so that first icoming "joined" event is not filtered out
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
  });
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

// ui-only actions (client-side view state)
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const toggleUserMenu = () => ({type: TOGGLE_USER_MENU});

