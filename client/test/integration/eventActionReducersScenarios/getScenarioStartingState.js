import initialState from '../../../src/state/initialState';
import rootReducer from '../../../src/state/rootReducer';
import {COMMAND_SENT} from '../../../src/state/actions/commandActions';

/**
 * Returns a shallow copy of the whole redux initial state  with the property "pendingJoinCommandId" correctly set to the given correlationId.
 * In "real life" this is done in the recuder of "COMMAND_SENT" ... we have to manually do it during test runs.
 *
 * @param joinEventCorrelationId
 * @return {object} state
 * */
export default function getScenarioStartingState(joinEventCorrelationId) {
  return fakeJoinCommandSentState(initialState(), joinEventCorrelationId);
}

export function fakeJoinCommandSentState(state, joinEventCorrelationId) {
  return rootReducer(state, {
    type: COMMAND_SENT,
    command: {
      name: 'joinRoom',
      roomId: '-doesnt-matter-here',
      payload: {
        username: '-doesnt-matter-here',
        avatar: 0
      },
      id: joinEventCorrelationId
    }
  });
}
