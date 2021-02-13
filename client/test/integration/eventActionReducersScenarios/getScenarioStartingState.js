import initialState from '../../../app/state/initialState';
import {commandTrackingInitialState} from '../../../app/state/commandTracking/commandTrackingReducer';

/**
 * Returns a shallow copy of the whole redux initial state  with the property "commandTracking.pendingJoinCommandId" correctly set to the given correlationId.
 * In "real life" this is done in the recuder of "COMMAND_SENT" ... we have to manually do it during test runs.
 *
 * @param joinEventCorrelationId
 * @return {object} state
 * */
export default function getScenarioStartingState(joinEventCorrelationId) {
  return {
    ...initialState(),
    commandTracking: {
      ...commandTrackingInitialState,
      pendingJoinCommandId: joinEventCorrelationId
    }
  };
}
