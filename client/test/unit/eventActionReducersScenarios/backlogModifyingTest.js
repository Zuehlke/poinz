import {v4 as uuid} from 'uuid';

import initialState from '../../../app/store/initialState.js';
import {EVENT_ACTION_TYPES} from '../../../app/actions/types';
import reduceMultipleEventActions from './reduceMultipleEventActions';
import eventReducer from '../../../app/services/eventReducer';

test('Adding stories', () => {
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
          excluded: false,
          username: 'Other John'
        }
      },
      stories: {}
    }
  };

  const firstStoryId = uuid();
  const secondStoryId = uuid();
  const eventActions = [
    {
      event: {
        id: uuid(),
        userId: ownUserId,
        correlationId: uuid(),
        name: 'storyAdded',
        roomId,
        payload: {
          title: 'FirstStory',
          description: 'description one',
          id: firstStoryId,
          estimations: {},
          createdAt: 1592115935676
        }
      },
      type: EVENT_ACTION_TYPES.storyAdded
    },
    {
      event: {
        id: uuid(),
        userId: ownUserId,
        correlationId: uuid(),
        name: 'storySelected',
        roomId,
        payload: {
          storyId: firstStoryId
        }
      },
      type: EVENT_ACTION_TYPES.storySelected
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'storyAdded',
        roomId,
        payload: {
          title: 'Second story',
          description: 'dscription second... from other john',
          id: secondStoryId,
          estimations: {},
          createdAt: 1592115972307
        }
      },
      type: 'STORY_ADDED'
    }
  ];

  modifiedState = reduceMultipleEventActions(startingState, eventActions);
  expect(modifiedState.selectedStory).toEqual(firstStoryId);
  expect(modifiedState.stories).toEqual({
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
  });
});

test('Editing stories', () => {
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
          editMode: true,
          createdAt: 1592115972307,
          description: 'dscription second... from other john',
          estimations: {},
          id: secondStoryId,
          title: 'Second story'
        },
        [firstStoryId]: {
          editMode: true,
          createdAt: 1592115935676,
          description: 'description one',
          estimations: {},
          id: firstStoryId,
          title: 'FirstStory'
        }
      }
    }
  };

  const eventActions = [
    {
      event: {
        id: uuid(),
        userId: ownUserId,
        correlationId: uuid(),
        name: 'storyChanged',
        roomId,
        payload: {
          storyId: firstStoryId,
          title: 'Edited first Story',
          description: 'With edited description'
        }
      },
      type: EVENT_ACTION_TYPES.storyChanged
    },
    {
      event: {
        id: uuid(),
        userId: ownUserId,
        correlationId: uuid(),
        name: 'storySelected',
        roomId,
        payload: {
          storyId: secondStoryId
        }
      },
      type: EVENT_ACTION_TYPES.storySelected
    },
    {
      event: {
        id: uuid(),
        userId: otherUserId,
        correlationId: uuid(),
        name: 'storyChanged',
        roomId,
        payload: {
          storyId: secondStoryId,
          title: 'Edited second Story',
          description: 'With edited description (2)'
        }
      },
      type: EVENT_ACTION_TYPES.storyChanged
    }
  ];

  modifiedState = reduceMultipleEventActions(startingState, eventActions);
  expect(modifiedState.selectedStory).toEqual(secondStoryId);
  expect(modifiedState.applause).toEqual(false);
  expect(modifiedState.stories).toEqual({
    [secondStoryId]: {
      createdAt: 1592115972307,
      description: 'With edited description (2)',
      estimations: {},
      id: secondStoryId,
      editMode: false,
      title: 'Edited second Story'
    },
    [firstStoryId]: {
      createdAt: 1592115935676,
      description: 'With edited description',
      estimations: {},
      id: firstStoryId,
      editMode: false,
      title: 'Edited first Story'
    }
  });
});

test('Deleting stories', () => {
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

  const storyDeletedAction = {
    event: {
      id: uuid(),
      userId: otherUserId,
      correlationId: uuid(),
      name: 'storyDeleted',
      roomId,
      payload: {
        storyId: firstStoryId,
        title: 'sdgasdg'
      }
    },
    type: EVENT_ACTION_TYPES.storyDeleted
  };

  modifiedState = eventReducer(startingState, storyDeletedAction);
  expect(modifiedState.selectedStory).toEqual(firstStoryId);
  expect(modifiedState.stories).toEqual({
    [secondStoryId]: startingState.stories[secondStoryId]
  });
});
