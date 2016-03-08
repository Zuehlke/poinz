import { createHistory } from 'history';
import hub from './hub';
import {
  TOGGLE_BACKLOG,
  TOGGLE_USER_MENU
} from './actionTypes';


let history = createHistory();

export function joinRoom(roomId) {
  return (dispatch, getState) => {
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

    dispatch({
      type: 'SET_ROOMID',
      roomId: normalizedRoomId
    });

    hub.sendCommand({
      name: 'joinRoom',
      roomId: normalizedRoomId,
      payload: joinCommandPayload
    }, dispatch);
  };
}
export function addStory(storyTitle, storyDescription) {
  return (dispatch, getState)=> {
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
}

export function selectStory(storyId) {
  return (dispatch, getState) => {
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
}

export function giveStoryEstimate(storyId, value) {
  return (dispatch, getState)=> {
    const state = getState();
    let command;
    if (state.getIn(['stories', storyId, 'estimations', state.get('userId')]) === value) {
      command = {
        name: 'clearStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          userId: state.get('userId'),
          storyId: storyId
        }
      };
    } else {
      command = {
        name: 'giveStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          value: value,
          userId: state.get('userId'),
          storyId: storyId
        }
      };
    }

    hub.sendCommand(command, dispatch);
  };
}

export function newEstimationRound(storyId) {
  return (dispatch, getState)=> {
    const state = getState();
    hub.sendCommand({
      name: 'newEstimationRound',
      roomId: state.get('roomId'),
      payload: {
        storyId: storyId
      }
    }, dispatch);
  };
}

export function reveal(storyId) {
  return (dispatch, getState) => {
    const state = getState();
    hub.sendCommand({
      name: 'reveal',
      roomId: state.get('roomId'),
      payload: {
        storyId: storyId
      }
    }, dispatch);
  };
}

export function setUsername(username) {
  return (dispatch, getState) => {
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
}

export function setVisitor(isVisitor) {
  return (dispatch, getState) => {
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
}

export function leaveRoom() {
  return (dispatch, getState) => {
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
}

// ui-only actions (client-side application state)
export function toggleBacklog() {
  return {type: TOGGLE_BACKLOG};
}
export function toggleUserMenu() {
  return {type: TOGGLE_USER_MENU};
}

