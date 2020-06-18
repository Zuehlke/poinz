import {v4 as uuid} from 'uuid';

import initialState from '../../../app/store/initialState';
import {EVENT_ACTION_TYPES} from '../../../app/actions/types';
import reduceMultipleEventActions from './reduceMultipleEventActions';
import eventReducer from '../../../app/services/eventReducer';

test('Estimation with two users', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();
  const firstStoryId = uuid();
  const secondStoryId = uuid();

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
          excluded: false,
          username: 'Other John'
        }
      },
      selectedStory: firstStoryId,
      stories: {
        [secondStoryId]: {
          createdAt: 1592115972307,
          description: 'dscription second... from other john',
          estimations: {},
          id: secondStoryId,
          title: 'Second story'
        },
        [firstStoryId]: {
          createdAt: 1592115935676,
          description: 'description one',
          estimations: {},
          id: firstStoryId,
          title: 'FirstStory'
        }
      }
    }
  };

  // own user estimates firstStory
  const ownUserEstimateGivenAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'storyEstimateGiven',
      roomId,
      payload: {
        value: 3,
        storyId: firstStoryId
      }
    },
    type: EVENT_ACTION_TYPES.storyEstimateGiven
  };
  modifiedState = eventReducer(startingState, ownUserEstimateGivenAction);

  expect(modifiedState.stories[firstStoryId]).toEqual({
    createdAt: 1592115935676,
    description: 'description one',
    estimations: {
      [ownUserId]: 3
    },
    id: firstStoryId,
    title: 'FirstStory'
  });

  // own user cleares his estimation on firstStory
  const ownUserEstimationClearedAction = {
    event: {
      id: uuid(),
      userId: ownUserId,
      correlationId: uuid(),
      name: 'storyEstimateCleared',
      roomId,
      payload: {
        storyId: firstStoryId
      }
    },
    type: EVENT_ACTION_TYPES.storyEstimateCleared
  };
  modifiedState = eventReducer(startingState, ownUserEstimationClearedAction);

  expect(modifiedState.stories[firstStoryId]).toEqual({
    createdAt: 1592115935676,
    description: 'description one',
    estimations: {
      // now empty again
    },
    id: firstStoryId,
    title: 'FirstStory'
  });

  // now both users estimate 5 -> revealed and consensusAchieved
  const eventActions = [
    {
      event: {
        id: uuid(),
        userId: ownUserId,
        correlationId: uuid(),
        name: 'storyEstimateGiven',
        roomId,
        payload: {
          value: 5,
          storyId: firstStoryId
        }
      },
      type: EVENT_ACTION_TYPES.storyEstimateGiven
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'storyEstimateGiven',
        roomId,
        payload: {
          value: 5,
          storyId: firstStoryId
        }
      },
      type: EVENT_ACTION_TYPES.storyEstimateGiven
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'revealed',
        roomId,
        payload: {
          storyId: firstStoryId,
          manually: false
        }
      },
      type: EVENT_ACTION_TYPES.revealed
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'consensusAchieved',
        roomId,
        payload: {
          storyId: firstStoryId,
          value: 5
        }
      },
      type: EVENT_ACTION_TYPES.consensusAchieved
    }
  ];

  modifiedState = reduceMultipleEventActions(startingState, eventActions);

  expect(modifiedState.stories[firstStoryId]).toEqual({
    createdAt: 1592115935676,
    description: 'description one',
    estimations: {
      [ownUserId]: 5,
      [otherUserId]: 5
    },
    revealed: true,
    consensus: 5,
    id: firstStoryId,
    title: 'FirstStory'
  });
});

test('New estimation round with two users', () => {
  let modifiedState;

  const ownUserId = uuid();
  const otherUserId = uuid();
  const roomId = uuid();
  const firstStoryId = uuid();

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
          excluded: false,
          username: 'Other John'
        }
      },
      selectedStory: firstStoryId,
      stories: {
        [firstStoryId]: {
          createdAt: 1592115935676,
          description: 'description one',
          estimations: {
            [ownUserId]: 5,
            [otherUserId]: 8
          },
          revealed: true,
          id: firstStoryId,
          title: 'FirstStory'
        }
      }
    }
  };

  // own user starts a new round on the firstStory
  const ownUserNewEstimationRoundAction = {
    event: {
      id: uuid(),
      userId: firstStoryId,
      correlationId: uuid(),
      name: 'newEstimationRoundStarted',
      roomId,
      payload: {
        storyId: firstStoryId
      }
    },
    type: EVENT_ACTION_TYPES.newEstimationRoundStarted
  };
  modifiedState = eventReducer(startingState, ownUserNewEstimationRoundAction);

  expect(modifiedState.stories).toEqual({
    [firstStoryId]: {
      createdAt: 1592115935676,
      description: 'description one',
      id: firstStoryId,
      estimations: {}, // old values removed
      consensus: undefined, // consensus set to undefined
      revealed: false, // revealed flag set to false
      title: 'FirstStory'
    }
  });
});
