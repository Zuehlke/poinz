import usersReducer from './users/usersReducer';
import storiesReducer from './stories/storiesReducer';
import estimationsReducer from './estimations/estimationsReducer';
import actionLogReducer from './actionLog/actionLogReducer';
import commandTrackingReducer from './commandTracking/commandTrackingReducer';
import roomReducer from './room/roomReducer';
import {getOwnUserId} from './users/usersSelectors';
import uiReducer from './ui/uiReducer';
import joiningReducer from './joining/joiningReducer';

const combinedNewReducers = combineReducers({
  users: usersReducer,
  stories: storiesReducer,
  estimations: estimationsReducer,
  commandTracking: commandTrackingReducer,
  room: roomReducer,
  ui: uiReducer,
  joining: joiningReducer
});

export default function (state, action) {
  const modifiedState = combinedNewReducers(state, action);

  return actionLogReducer({...state, ...modifiedState}, action, state);
}

/**
 * quite similar like the original "combineReducers" from redux.
 * (Without the dev/test env warnings)
 *
 * Main difference:  we pass the own userId from the current state as third argument to each reducer!
 * This allows every reducer to check whether a userId from an event matches our own.
 * Alternatively, we could have reduced own userId to every portion of the state, which is cumbersome.
 *
 */
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state = {}, action) {
    const ownUserId = getOwnUserId(state);
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action, ownUserId);
      if (typeof nextStateForKey === 'undefined') {
        throw new Error(`Reducer "${key}" returned undefined`);
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
