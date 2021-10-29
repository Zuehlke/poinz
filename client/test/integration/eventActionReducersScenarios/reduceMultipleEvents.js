import rootReducer from '../../../app/state/rootReducer';
import {eventReceived} from '../../../app/state/actions/eventActions';

/**
 * reduce a series of given events ("at once" , in sequence)
 *
 * @param startingState
 * @param events
 * @return {*}
 */
export default function reduceMultipleEvents(startingState, events) {
  let modifiedState = startingState;

  const ourDispatch = (action) => {
    modifiedState = rootReducer(modifiedState, action);
  };

  const ourGetState = () => modifiedState;

  // eslint-disable-next-line no-unused-vars
  events.forEach((e, index) => {
    // Uncomment the following line for debugging integration tests
    //  console.log(`[INTEGRATION_TEST] reducing event ${e.name} at scenario index ${index}`);
    eventReceived(e)(ourDispatch, ourGetState);
  });
  return modifiedState;
}
