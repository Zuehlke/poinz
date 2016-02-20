import log from 'loglevel';
import Immutable from 'immutable';
import * as types from './actionTypes';
import clientSettingsStore from './clientSettingsStore';

const LOGGER = log.getLogger('eventReducer');

function eventReducerFactory() {
  /**
   * redux reducer for incoming backend events
   */
  return function eventReducer(state, action) {

    const { event } = action;
    const { payload } = event;

    switch (action.type) {
      case types.ROOM_CREATED:
        return state;
      case types.MODERATOR_SET:
        return state.set('moderatorId', payload.moderatorId);
      case types.JOINED_ROOM:

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
            .set('moderatorId', payload.moderatorId)
            .set('userId', payload.userId)
            .set('selectedStory', payload.selectedStory)
            .set('users', Immutable.fromJS(payload.users || {}))
            .set('stories', Immutable.fromJS(payload.stories || {}));
        }
        break;
      case types.LEFT_ROOM:
        if (state.get('userId') === payload.userId) {
          // you left the room, let's clear some state
          return state
            .remove('userId')
            .remove('roomId')
            .remove('stories')
            .remove('users')
            .remove('selectedStory')
            .remove('moderatorId');
        } else {
          // someone lef the room
          return state
            .update('stories', stories => stories.map(story => story.removeIn(['estimations', payload.userId])))  // remove leaving user's estimations from all stories
            .removeIn(['users', payload.userId]); // then remove user from room
        }
        break;
      case types.STORY_ADDED:
        const newStory = Immutable.fromJS(Object.assign(event.payload, {
          estimations: {}
        }));
        return state.update('stories', stories => stories.set(payload.id, newStory));
      case types.STORY_SELECTED:
        return state.set('selectedStory', payload.storyId);
      case types.USERNAME_SET:
        if (payload.userId === state.get('userId')) {
          clientSettingsStore.setPresetUsername(payload.username);
        }
        return state.updateIn(['users', payload.userId], person => person.set('username', payload.username));
      case types.STORY_ESTIMATE_GIVEN:
        return state.setIn(['stories', payload.storyId, 'estimations', payload.userId], payload.value);
      case types.STORY_ESTIMATE_CLEARED:
        return state.removeIn(['stories', payload.storyId, 'estimations', payload.userId]);
      case types.ALL_ESTIMATES_GIVEN:
        return state.setIn(['stories', payload.storyId, 'allEstimatesGiven'], true);
      case types.NEW_ESTIMATION_ROUND_STARTED:
        return state
          .setIn(['stories', payload.storyId, 'estimations'], new Immutable.Map())
          .setIn(['stories', payload.storyId, 'allEstimatesGiven'], false);
      case types.COMMAND_REJECTED:
        LOGGER.error(event);
        return state;
      default:
        LOGGER.warn('unknown action (backend event)', action);
        return state;
    }
  };
}


export default eventReducerFactory;
