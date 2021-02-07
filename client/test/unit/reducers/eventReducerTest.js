import {v4 as uuid} from 'uuid';

import eventReducer from '../../../app/state/reducers/eventReducer';
import {EVENT_ACTION_TYPES} from '../../../app/state/actions/eventActions';
import initialState from '../../../app/state/initialState.js';

test('happy case: reduces an eventAction and writes log item', () => {
  const roomId = uuid();

  const startingState = {
    ...initialState(),
    roomId,
    users: {}
  };

  const modifiedState = eventReducer(startingState, {
    event: {
      userId: uuid(),
      roomId
    },
    type: EVENT_ACTION_TYPES.connectionLost
  });

  expect(modifiedState).toBeDefined();
  expect(modifiedState.actionLog.length).toBe(1);
});

test('ignores actions where roomId does not match', () => {
  const roomId = uuid();

  const startingState = {
    ...initialState(),
    roomId
  };

  const modifiedState = eventReducer(startingState, {
    event: {
      roomId: 'not-matching-room'
    }
  });

  expect(modifiedState).toBe(startingState);
});

test('ignores actions where no matching eventAction handler', () => {
  const roomId = uuid();

  const startingState = {
    ...initialState(),
    roomId
  };

  const modifiedState = eventReducer(startingState, {
    event: {
      roomId
    },
    type: 'does notmatch'
  });

  expect(modifiedState).toBe(startingState);
});
