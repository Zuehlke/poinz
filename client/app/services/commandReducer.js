import log from 'loglevel';
import { createHistory } from 'history';
import hub from './hub';

import {
  JOIN_ROOM,
  ADD_STORY,
  SELECT_STORY,
  GIVE_STORY_ESTIMATE,
  NEW_ESTIMATION_ROUND,
  REVEAL, SET_USERNAME,
  SET_VISITOR,
  LEAVE_ROOM
} from './actionTypes';

let history = createHistory();

const LOGGER = log.getLogger('commandReducer');

const commandActionHandlers = {
  [JOIN_ROOM]: (state, action) => {
    const roomId = action.roomId.toLowerCase();
    history.push({
      pathname: `/${roomId}`
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

    // set flag on state, so that app view can display "loading"
    // set requested roomId prematurely so that incoming "roomJoined" event is not filtered out
    return state
      .set('waitingForJoin', true)
      .set('roomId', roomId);
  },
  [LEAVE_ROOM]: (state) => {
    history.push({
      pathname: ''
    });
    hub.sendCommand({
      name: 'leaveRoom',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId')
      }
    });
  },
  [SET_USERNAME]: (state, commandPayload) => {
    hub.sendCommand({
      name: 'setUsername',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId'),
        username: commandPayload.username
      }
    });
  },
  [SET_VISITOR]: (state, commandPayload) => {
    hub.sendCommand({
      name: 'setVisitor',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId'),
        isVisitor: commandPayload.isVisitor
      }
    });
  },
  [ADD_STORY]: (state, commandPayload) => {
    hub.sendCommand({
      name: 'addStory',
      roomId: state.get('roomId'),
      payload: {
        title: commandPayload.title,
        description: commandPayload.description
      }
    });
  },
  [GIVE_STORY_ESTIMATE]: (state, commandPayload) => {
    if (state.getIn(['stories', commandPayload.storyId, 'estimations', state.get('userId')]) === commandPayload.value) {
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

    // mark value in current story for user feedback
    return state.setIn(['stories', commandPayload.storyId, 'estimationWaiting'], commandPayload.value);
  },
  [NEW_ESTIMATION_ROUND]: (state, commandPayload) => {
    hub.sendCommand({
      name: 'newEstimationRound',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  },
  [SELECT_STORY]: (state, commandPayload) => {
    if (state.get('selectedStory') === commandPayload.storyId) {
      return;
    }

    hub.sendCommand({
      name: 'selectStory',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });

    // mark story for visual user feedback
    return state.setIn(['stories', commandPayload.storyId, 'waitingForSelect'], true);
  },
  [REVEAL]: (state, commandPayload) => {
    hub.sendCommand({
      name: 'reveal',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  }

};

function commandReducer(state, action) {
  if (commandActionHandlers[action.type]) {
    const modifiedState = commandActionHandlers[action.type](state, action.command);
    return modifiedState || state;
  } else {
    LOGGER.warn('unknown command action', action);
    return state;
  }
}

export default commandReducer;
