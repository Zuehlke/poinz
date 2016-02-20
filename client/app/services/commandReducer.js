import log from 'loglevel';
import { createHistory } from 'history';
import * as types from './actionTypes';

let history = createHistory();

const LOGGER = log.getLogger('commandReducer');

const actionToCommandMap = {
  [types.JOIN_ROOM]: (hub, state, action) => {
    const { roomId } = action;
    history.push({
      hash: `#${roomId}`
    });

    const joinCommandPayload = {};

    if (state.get('presetUserId')) {
      joinCommandPayload.userId = state.get('presetUserId');
    }
    if (state.get('presetUsername')) {
      joinCommandPayload.username = state.get('presetUsername');
    }

    hub.sendCommand({
      name: 'joinRoom',
      roomId: roomId,
      payload: joinCommandPayload
    });
  },
  [types.LEAVE_ROOM]: (hub, state) => {
    history.push({
      hash: ''
    });
    hub.sendCommand({
      name: 'leaveRoom',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId')
      }
    });
  },
  [types.SET_USERNAME]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'setUsername',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId'),
        username: commandPayload.username
      }
    });
  },
  [types.ADD_STORY]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'addStory',
      roomId: state.get('roomId'),
      payload: {
        title: commandPayload.title,
        description: commandPayload.description
      }
    });
  },
  [types.GIVE_STORY_ESTIMATE]: (hub, state, commandPayload) => {
    if (state.getIn(['stories', state.get('selectedStory'), 'estimations', state.get('userId')]) === commandPayload.value) {
      hub.sendCommand({
        name: 'clearStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          userId: state.get('userId'),
          storyId: commandPayload.storyId
        }
      });
    } else {
      hub.sendCommand({
        name: 'giveStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          value: commandPayload.value,
          userId: state.get('userId'),
          storyId: commandPayload.storyId
        }
      });
    }
  },
  [types.NEW_ESTIMATION_ROUND]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'newEstimationRound',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  },
  [types.SELECT_STORY]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'selectStory',
      roomId: state.get('roomId'),
      payload: {
        id: commandPayload.storyId
      }
    });
  }

};


function commandReducerFactory(hub) {
  return function commandReducer(state, action) {
    if (actionToCommandMap[action.type]) {
      const modifiedState = actionToCommandMap[action.type](hub, state, action.command);
      return modifiedState || state;
    } else {
      LOGGER.warn('unknown command action', action);
      return state;
    }
  };
}


export default commandReducerFactory;
