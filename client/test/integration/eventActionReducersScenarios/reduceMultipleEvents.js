import log from 'loglevel';

import rootReducer from '../../../app/state/reducers/rootReducer';
import {EVENT_ACTION_TYPES, EVENT_RECEIVED} from '../../../app/state/actions/eventActions';

/**
 * reduce a series of given events ("at once" , in sequence)
 *
 * @param startingState
 * @param events
 * @return {*}
 */
export default function reduceMultipleEvents(startingState, events) {
  let modifiedState = startingState;
  events.forEach((e) => {
    modifiedState = rootReducer(modifiedState, {
      type: EVENT_RECEIVED,
      eventName: e.name,
      correlationId: e.correlationId
    });

    const matchingType = EVENT_ACTION_TYPES[e.name];

    if (!matchingType) {
      log.warn(`No matching action type for event "${e.name}"`);
    }

    modifiedState = rootReducer(modifiedState, {
      event: e,
      type: matchingType
    });
  });
  return modifiedState;
}
