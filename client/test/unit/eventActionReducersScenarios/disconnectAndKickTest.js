import {v4 as uuid} from 'uuid';

import eventReducer from '../../../app/services/eventReducer';
import initialState from '../../../app/store/initialState.js';
import {EVENT_ACTION_TYPES} from '../../../app/actions/types';
import clientSettingsStore from '../../../app/store/clientSettingsStore';

test('Two users in a room, the other one disconnects, then you kick him', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();
  const storyId = uuid();
  const storyTwoId = uuid();

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
          disconnected: false,
          id: otherUserId,
          username: 'The other One'
        }
      },
      stories: {
        [storyId]: {
          title: 'First Story',
          description: 'With description',
          id: storyId,
          estimations: {
            [otherUserId]: 8,
            [ownUserId]: 5
          },
          createdAt: 1592120422988
        },
        [storyTwoId]: {
          title: 'Some other Story',
          description: 'Also with a description',
          id: storyId,
          estimations: {
            [ownUserId]: 5
          },
          createdAt: 1592120422988
        }
      }
    }
  };
  clientSettingsStore.setPresetUserId(ownUserId);

  const connectionLostAction = {
    event: {
      id: uuid(),
      userId: otherUserId,
      correlationId: uuid(),
      name: 'connectionLost',
      roomId,
      payload: {}
    },
    type: EVENT_ACTION_TYPES.connectionLost
  };
  modifiedState = eventReducer(startingState, connectionLostAction);

  // in contrast to "roomLeft",  on "connectionLost", user object stays. is marked as disconnected
  expect(modifiedState.users[otherUserId]).toEqual({
    disconnected: true,
    id: otherUserId,
    username: 'The other One'
  });

  // also the estimation of the disconnected user is still in state
  expect(modifiedState.stories[storyId].estimations).toEqual({
    [otherUserId]: 8,
    [ownUserId]: 5
  });

  const kickedAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'kicked',
      roomId,
      payload: {
        userId: otherUserId
      }
    },
    type: EVENT_ACTION_TYPES.kicked
  };
  modifiedState = eventReducer(startingState, kickedAction);

  // now only our own user is left
  expect(modifiedState.users).toEqual({
    [ownUserId]: startingState.users[ownUserId]
  });

  // estimation values are kept, even for kicked users
  expect(modifiedState.stories[storyId].estimations).toEqual({
    [otherUserId]: 8,
    [ownUserId]: 5
  });
});
