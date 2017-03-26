import eventReducer from './eventReducer';
import clientActionReducer from './clientActionReducer';

/**
 * the root redux reducer that decides if
 * - the action should be handled by an event reducer (when a backend event gets applied to our client state)
 * - the action is a client-only action (some state changes in the client only, i.e. view state)
 *
 * @param state
 * @param {object} action the redux action
 * @returns {Immutable.Map} the modified state
 */
export default function rootReducer(state = {}, action = {}) {
  if (action.event) {
    return eventReducer(state, action);
  } else {
    return clientActionReducer(state, action);
  }
}
