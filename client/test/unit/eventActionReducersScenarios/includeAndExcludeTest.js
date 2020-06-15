import {v4 as uuid} from 'uuid';

import initialState from '../../../app/store/initialState';
import {EVENT_ACTION_TYPES} from '../../../app/actions/types';
import eventReducer from '../../../app/services/eventReducer';

test('Exclude and Include', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();

  const startingState = {
    ...initialState(),
    ...{
      presetUsername: 'Jim',
      presetEmail: null,
      presetUserId: null,
      userMenuShown: false,
      roomId,
      userId: ownUserId,
      users: {
        [ownUserId]: {
          disconnected: false,
          id: ownUserId,
          username: 'Jim'
        },
        [otherUserId]: {
          id: otherUserId,
          disconnected: false,
          username: 'Other John'
        }
      }
    }
  };

  // own user excluded himself
  const excludedAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'excludedFromEstimations',
      roomId,
      payload: {}
    },
    type: EVENT_ACTION_TYPES.excludedFromEstimations
  };
  modifiedState = eventReducer(startingState, excludedAction);

  expect(modifiedState.users[ownUserId]).toEqual({
    disconnected: false,
    excluded: true,
    id: ownUserId,
    username: 'Jim'
  });

  // own user included himself again
  const includedAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'includedInEstimations',
      roomId,
      payload: {}
    },
    type: EVENT_ACTION_TYPES.includedInEstimations
  };
  modifiedState = eventReducer(startingState, includedAction);

  expect(modifiedState.users[ownUserId]).toEqual({
    disconnected: false,
    excluded: false,
    id: ownUserId,
    username: 'Jim'
  });
});
