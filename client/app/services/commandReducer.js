import log from 'loglevel';
import { createHistory } from 'history';
import {
  JOIN_ROOM,
  ADD_STORY,
  SELECT_STORY,
  GIVE_STORY_ESTIMATE,
  NEW_ESTIMATION_ROUND,
  REVEAL, SET_USERNAME,
  TOGGLE_VISITOR,
  LEAVE_ROOM
} from './actionTypes';

let history = createHistory();

const LOGGER = log.getLogger('commandReducer');

const commandActionHandlers = {
  [JOIN_ROOM]: (hub, state, action) => {
    const { roomId } = action;
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
  [LEAVE_ROOM]: (hub, state) => {
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
  [SET_USERNAME]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'setUsername',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId'),
        username: commandPayload.username
      }
    });
  },
  [TOGGLE_VISITOR]: (hub, state) => {
    hub.sendCommand({
      name: 'setVisitor',
      roomId: state.get('roomId'),
      payload: {
        userId: state.get('userId'),
        isVisitor: !state.getIn(['users', state.get('userId'), 'visitor'])
      }
    });
  },
  [ADD_STORY]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'addStory',
      roomId: state.get('roomId'),
      payload: {
        title: commandPayload.title,
        description: commandPayload.description
      }
    });
  },
  [GIVE_STORY_ESTIMATE]: (hub, state, commandPayload) => {
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
  [NEW_ESTIMATION_ROUND]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'newEstimationRound',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  },
  [SELECT_STORY]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'selectStory',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  },
  [REVEAL]: (hub, state, commandPayload) => {
    hub.sendCommand({
      name: 'reveal',
      roomId: state.get('roomId'),
      payload: {
        storyId: commandPayload.storyId
      }
    });
  }

};

function commandReducerFactory(hub) {
  return function commandReducer(state, action) {
    if (commandActionHandlers[action.type]) {
      const modifiedState = commandActionHandlers[action.type](hub, state, action.command);
      return modifiedState || state;
    } else {
      LOGGER.warn('unknown command action', action);
      return state;
    }
  };
}


export default commandReducerFactory;
