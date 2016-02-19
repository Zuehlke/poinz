import log from 'loglevel';
import { createHistory } from 'history';
import * as types from './actionTypes';

let history = createHistory();

const LOGGER = log.getLogger('commandReducer');

const actionToCommandMap = {
  [types.JOIN_ROOM]: (hub, state, action) => {
    const { roomId, username } = action;
    history.push({
      hash: `#${roomId}`
    });
    hub.sendCommand({
      name: 'joinRoom',
      roomId: roomId,
      payload: {
        username: username
      }
    });
  },
  [types.ADD_STORY]: (hub, state, action) => {
    hub.sendCommand({
      name: 'addStory',
      roomId: state.get('roomId'),
      payload: {
        title: action.title,
        description: action.description
      }
    });
  },
  [types.GIVE_STORY_ESTIMATE]: (hub, state, action) => {
    if (state.getIn(['stories', state.get('selectedStory'), 'estimations', state.get('userId')]) === action.value) {
      hub.sendCommand({
        name: 'clearStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          userId: state.get('userId'),
          storyId: action.storyId
        }
      });
    } else {
      hub.sendCommand({
        name: 'giveStoryEstimate',
        roomId: state.get('roomId'),
        payload: {
          value: action.value,
          userId: state.get('userId'),
          storyId: action.storyId
        }
      });
    }
  },
  [types.NEW_ESTIMATION_ROUND]: (hub, state, action) => {
    hub.sendCommand({
      name: 'newEstimationRound',
      roomId: state.get('roomId'),
      payload: {
        storyId: action.storyId
      }
    });
  },
  [types.SELECT_STORY]: (hub, state, action) => {
    hub.sendCommand({
      name: 'selectStory',
      roomId: state.get('roomId'),
      payload: {
        id: action.storyId
      }
    });
  }

};


function commandReducerFactory(hub) {
  return function commandReducer(state, action) {
    if (actionToCommandMap[action.type]) {
      const modifiedState = actionToCommandMap[action.type](hub, state, action);
      return modifiedState || state;
    } else {
      LOGGER.warn('unknown action', action);
      return state
    }
  };
}


export default commandReducerFactory;
