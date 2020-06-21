import {v4 as uuid} from 'uuid';

import initialState from '../../../app/store/initialState.js';
import {EVENT_ACTION_TYPES} from '../../../app/actions/types';
import clientSettingsStore from '../../../app/store/clientSettingsStore';
import reduceMultipleEventActions from './reduceMultipleEventActions';
import eventReducer from '../../../app/services/eventReducer';

test('You joining a new room', () => {
  const cmdId = uuid();

  const startingState = {
    ...initialState(),
    pendingJoinCommandId: cmdId
  };
  let modifiedState;

  const userId = uuid();
  const roomId = uuid();
  const eventActions = [
    {
      event: {
        id: uuid(),
        userId: userId,
        correlationId: cmdId,
        name: 'roomCreated',
        roomId,
        payload: {}
      },
      type: EVENT_ACTION_TYPES.roomCreated
    },
    {
      event: {
        id: uuid(),
        userId: userId,
        correlationId: cmdId,
        name: 'joinedRoom',
        roomId,
        payload: {
          users: {
            [userId]: {
              disconnected: false,
              id: userId,
              avatar: 4
            }
          },
          stories: {}
        }
      },
      type: EVENT_ACTION_TYPES.joinedRoom
    },
    {
      event: {
        id: uuid(),
        userId: userId,
        correlationId: uuid(),
        name: 'usernameSet',
        roomId,
        payload: {
          username: 'Chrome'
        }
      },
      type: EVENT_ACTION_TYPES.usernameSet
    },
    {
      event: {
        id: uuid(),
        userId: userId,
        correlationId: uuid(),
        name: 'emailSet',
        roomId,
        payload: {
          email: 'test@super.com'
        }
      },
      type: EVENT_ACTION_TYPES.emailSet
    },
    {
      event: {
        id: uuid(),
        userId: userId,
        correlationId: uuid(),
        name: 'avatarSet',
        roomId,
        payload: {
          avatar: 4
        }
      },
      type: EVENT_ACTION_TYPES.avatarSet
    }
  ];

  modifiedState = reduceMultipleEventActions(startingState, eventActions);

  expect(modifiedState.roomId).toEqual(roomId);
  expect(modifiedState.userId).toEqual(userId);
  expect(modifiedState.users).toEqual({
    [userId]: {
      disconnected: false,
      id: userId,
      username: 'Chrome',
      email: 'test@super.com',
      avatar: 4
    }
  });

  expect(clientSettingsStore.getPresetUserId()).toEqual(userId);
  expect(clientSettingsStore.getPresetUsername()).toEqual('Chrome');
  expect(clientSettingsStore.getPresetEmail()).toEqual('test@super.com');
  expect(clientSettingsStore.getPresetAvatar()).toEqual(4);
});

test('You in a room, other user joins', () => {
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
        }
      },
      stories: {}
    }
  };
  clientSettingsStore.setPresetUserId(ownUserId);

  const eventActions = [
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'joinedRoom',
        roomId,
        payload: {
          users: {
            [ownUserId]: {
              id: ownUserId,
              username: 'Jim'
            },
            [otherUserId]: {
              id: otherUserId,
              disconnected: false,
              excluded: false
            }
          },
          stories: {}
        }
      },
      type: EVENT_ACTION_TYPES.joinedRoom
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'usernameSet',
        roomId,
        payload: {
          username: 'Other John'
        }
      },
      type: EVENT_ACTION_TYPES.usernameSet
    }
  ];

  modifiedState = reduceMultipleEventActions(startingState, eventActions);

  expect(modifiedState.roomId).toEqual(roomId);
  expect(modifiedState.userId).toEqual(ownUserId);
  expect(modifiedState.users).toEqual({
    [otherUserId]: {
      disconnected: false,
      excluded: false,
      id: otherUserId,
      username: 'Other John'
    },
    [ownUserId]: {
      disconnected: false,
      id: ownUserId,
      username: 'Jim'
    }
  });

  expect(clientSettingsStore.getPresetUserId()).toEqual(ownUserId);
});

test('Two users in a room, the other leaves', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();
  const storyId = uuid();

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
            [otherUserId]: 8
          },
          createdAt: 1592120422988
        }
      }
    }
  };
  clientSettingsStore.setPresetUserId(ownUserId);

  const leftRoomAction = {
    event: {
      id: uuid(),
      userId: otherUserId,
      correlationId: uuid(),
      name: 'leftRoom',
      roomId,
      payload: {}
    },
    type: EVENT_ACTION_TYPES.leftRoom
  };

  modifiedState = eventReducer(startingState, leftRoomAction);

  expect(modifiedState.users).toEqual({
    [ownUserId]: startingState.users[ownUserId]
  });

  expect(modifiedState.stories).toEqual({
    [storyId]: {
      title: 'First Story',
      description: 'With description',
      id: storyId,
      estimations: {
        /* estimations from leaving user are removed */
      },
      createdAt: 1592120422988
    }
  });
});

test('Two users in a room, you leave', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();
  const storyId = uuid();

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
            [otherUserId]: 8
          },
          createdAt: 1592120422988
        }
      }
    }
  };
  clientSettingsStore.setPresetUserId(ownUserId);

  const leftRoomAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'leftRoom',
      roomId,
      payload: {}
    },
    type: EVENT_ACTION_TYPES.leftRoom
  };

  modifiedState = eventReducer(startingState, leftRoomAction);

  // When own user leaves, tate is reset. except, actionLog has one new entry (log is added after event reduced).

  expect(modifiedState.actionLog.length).toBe(1);
  // so we set it to an empty array manually here
  modifiedState.actionLog = [];
  expect(modifiedState).toEqual(initialState());
});
