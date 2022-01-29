/*
 * in our frontend, we store stories as object (key is the story's id). this differs from the PoinZ Backend, where stories is a array...
 */
import {EVENT_ACTION_TYPES, ROOM_STATE_FETCHED} from '../actions/eventActions';
import {STORY_EDIT_MODE_CANCELLED, STORY_EDIT_MODE_ENTERED} from '../actions/uiStateActions';

export const storiesInitialState = {
  selectedStoryId: undefined,
  storiesById: {}
};

/**
 *
 * @param {object} state The "stories" portion of the redux state
 * @param action
 * @param {string | undefined} ownUserId
 * @return {object}
 */
export default function storiesReducer(state = storiesInitialState, action, ownUserId) {
  const {event} = action;

  switch (action.type) {
    case ROOM_STATE_FETCHED:
      return {
        ...state,
        selectedStoryId: action.room.selectedStory,
        storiesById: indexStories(action.room.stories)
      };

    // joining and leaving
    case EVENT_ACTION_TYPES.joinedRoom: {
      if (action.ourJoin) {
        return {
          ...state,
          selectedStoryId: event.payload.selectedStory,
          storiesById: indexStories(event.payload.stories)
        };
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.leftRoom: {
      if (event.userId === ownUserId) {
        return {...storiesInitialState};
      } else {
        return state;
      }
    }
    case EVENT_ACTION_TYPES.kicked: {
      if (event.payload.userId === ownUserId) {
        return {...storiesInitialState};
      } else {
        return state;
      }
    }

    // stories / backlog modifications
    case EVENT_ACTION_TYPES.storyAdded:
      return modifyStory(state, event.payload.storyId, () => ({
        id: event.payload.storyId,
        title: event.payload.title,
        description: event.payload.description,
        createdAt: event.payload.createdAt
      }));
    case EVENT_ACTION_TYPES.storyChanged:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        title: event.payload.title,
        description: event.payload.description,
        editMode: false
      }));
    case EVENT_ACTION_TYPES.storyTrashed:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        trashed: true,
        editMode: false
      }));
    case EVENT_ACTION_TYPES.storyRestored:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        trashed: false
      }));
    case EVENT_ACTION_TYPES.storyDeleted: {
      const modifiedStoriesById = {...state.storiesById};
      delete modifiedStoriesById[event.payload.storyId];
      return {
        ...state,
        storiesById: modifiedStoriesById
      };
    }

    // selecting and estimating.
    // Note:  actual estimation values are separate on own portion of redux state, here we track status of the story itself
    case EVENT_ACTION_TYPES.storySelected:
      return {...state, selectedStoryId: event.payload.storyId};
    case EVENT_ACTION_TYPES.consensusAchieved:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        consensus: event.payload.value
      }));
    case EVENT_ACTION_TYPES.revealed:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        revealed: true
      }));
    case EVENT_ACTION_TYPES.newEstimationRoundStarted:
      return modifyStory(state, event.payload.storyId, (story) => ({
        ...story,
        revealed: false,
        consensus: undefined
      }));

    // ui state flags
    case STORY_EDIT_MODE_ENTERED:
      return modifyStory(state, action.storyId, (story) => ({
        ...story,
        editMode: true
      }));
    case STORY_EDIT_MODE_CANCELLED: {
      return modifyStory(state, action.storyId, (story) => ({
        ...story,
        editMode: false
      }));
    }
  }

  return state;
}

/**
 * Index given stories array by storyId into a map.
 * In our frontend the stories are not held as array, but as map. Estimations & Estimations-Confidence are deleted (kept separate)
 *
 * @param {object[]} storiesArray Array of story objects as in payload of backend events
 * @return {*}
 */
function indexStories(storiesArray) {
  return (storiesArray || []).reduce((total, stry) => {
    total[stry.id] = {...stry};
    delete total[stry.id].estimations;
    delete total[stry.id].estimationsConfidence;
    return total;
  }, {});
}

/**
 * Modify one story in the state
 *
 * @param {object} state the "users" part of the redux state
 * @param storyId
 * @param {function} modifier Will be invoked with the matching story from the state (which can be undefined, if no such story is in the state)
 */
function modifyStory(state, storyId, modifier) {
  const modifiedStory = modifier(state.storiesById[storyId]);

  return {
    ...state,
    storiesById: {
      ...state.storiesById,
      [storyId]: modifiedStory
    }
  };
}
