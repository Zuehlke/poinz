import log from 'loglevel';
import Immutable from 'immutable';
import * as types from './actionTypes';
import clientSettingsStore from './clientSettingsStore';

const LOGGER = log.getLogger('eventReducer');

const eventActionHandlers = {
  [types.ROOM_CREATED]: (state) => state,
  [types.JOINED_ROOM]: (state, payload, event) => {
    if (state.get('userId')) {
      // someone else joined
      return state.setIn(['users', payload.userId], Immutable.fromJS(payload.users[payload.userId]));
    } else {
      // you joined

      clientSettingsStore.setPresetUserId(payload.userId);

      // server sends current room state (users, stories, etc.)
      return state
        .set('waitingForJoin', false)
        .set('roomId', event.roomId)
        .set('userId', payload.userId)
        .set('selectedStory', payload.selectedStory)
        .set('users', Immutable.fromJS(payload.users || {}))
        .set('stories', Immutable.fromJS(payload.stories || {}));
    }
  },
  [types.LEFT_ROOM]: (state, payload) => {

    const isOwnUser = state.get('userId') === payload.userId;

    if (isOwnUser) {
      // you (or you in another browser) left the room
      // let's clear some state
      return state
        .remove('userId')
        .remove('roomId')
        .remove('stories')
        .remove('users')
        .remove('selectedStory');

    } else {
      // someone else left the room
      return state
        .update('stories', stories => stories.map(story => story.removeIn(['estimations', payload.userId])))  // remove leaving user's estimations from all stories
        .removeIn(['users', payload.userId]); // then remove user from room
    }
  },
  [types.CONNECTION_LOST]: (state, payload) => {
    return state.updateIn(['users', payload.userId], user => user.set('disconnected', true));
  },
  [types.STORY_ADDED]: (state, payload) => {
    const newStory = Immutable.fromJS(payload);
    return state.update('stories', stories => stories.set(payload.id, newStory));
  },
  [types.STORY_SELECTED]: (state, payload) => state.set('selectedStory', payload.storyId),
  [types.USERNAME_SET]: (state, payload) => {
    if (payload.userId === state.get('userId')) {
      clientSettingsStore.setPresetUsername(payload.username);
    }
    return state.updateIn(['users', payload.userId], user => user.set('username', payload.username));
  },
  [types.VISITOR_SET]: (state, payload) => state.updateIn(['users', payload.userId], person => person.set('visitor', true)),
  [types.VISITOR_UNSET]: (state, payload) => state.updateIn(['users', payload.userId], person => person.set('visitor', false)),
  [types.STORY_ESTIMATE_GIVEN]: (state, payload) => state.setIn(['stories', payload.storyId, 'estimations', payload.userId], payload.value),
  [types.STORY_ESTIMATE_CLEARED]: (state, payload) => state.removeIn(['stories', payload.storyId, 'estimations', payload.userId]),
  [types.ALL_ESTIMATES_GIVEN]: (state, payload) => state.setIn(['stories', payload.storyId, 'allEstimatesGiven'], true),
  [types.NEW_ESTIMATION_ROUND_STARTED]: (state, payload) => state
    .setIn(['stories', payload.storyId, 'estimations'], new Immutable.Map())
    .setIn(['stories', payload.storyId, 'allEstimatesGiven'], false),
  [types.COMMAND_REJECTED]: (state, payload, event) => LOGGER.error(event)
};


function eventReducer(state, action) {

  const { event } = action;

  // currently, events from other rooms do not affect us (backend should not send such events in the first place)
  // so we do not modify our client-side state in any way
  if (state.get('roomId') !== event.roomId) {
    LOGGER.warn('Event with different roomId received');
    return state;
  }

  if (eventActionHandlers[action.type]) {
    const modifiedState = eventActionHandlers[action.type](state, event.payload, event);
    return modifiedState || state;
  } else {
    LOGGER.warn('unknown event action', action);
    return state;
  }
}

export default eventReducer;
