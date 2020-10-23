import log from 'loglevel';

import rootReducer from '../../../app/services/rootReducer';
import {EVENT_ACTION_TYPES, EVENT_RECEIVED} from '../../../app/actions/types';

export default function reduceMultipleEvents(startingState, events) {
  let modfifiedState = startingState;
  events.forEach((e) => {
    modfifiedState = rootReducer(modfifiedState, {
      type: EVENT_RECEIVED,
      eventName: e.name,
      correlationId: e.correlationId
    });

    const matchingType = EVENT_ACTION_TYPES[e.name];

    if (!matchingType) {
      log.warn(`No matching action type for event "${e.name}"`);
    }

    modfifiedState = rootReducer(modfifiedState, {
      event: e,
      type: matchingType
    });
  });
  return modfifiedState;
}
