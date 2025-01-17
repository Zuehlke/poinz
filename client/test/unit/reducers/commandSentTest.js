import uuid from '../../../app/services/uuid';
import rootReducer from '../../../app/state/rootReducer';
import initialState from '../../../app/state/initialState';
import {COMMAND_SENT} from '../../../app/state/actions/commandActions';
import {
  hasMatchingPendingCommand,
  isThisCardWaiting,
  isThisStoryEditFormWaiting,
  isThisStoryWaiting
} from '../../../app/state/commandTracking/commandTrackingSelectors';

test(COMMAND_SENT + ' : arbitrary command should correctly be reduced to state ', () => {
  const roomId = uuid();
  const startingState = {...initialState()};
  startingState.room.roomId = roomId;

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'setUsername',
      payload: {
        username: 'tester'
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId: '3a7baa33-b516-40e0-b499-e3f85d023edd',
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'setUsername')).toBe(true);
});

test(COMMAND_SENT + ' : giveStoryEstimate  ', () => {
  const roomId = uuid();
  const startingState = {...initialState()};
  startingState.room.roomId = roomId;

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'giveStoryEstimate',
      payload: {
        storyId: 'dc3c0809-2c6e-42fd-93d2-3ee538113f12',
        value: 8
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId: '3a7baa33-b516-40e0-b499-e3f85d023edd',
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'giveStoryEstimate')).toBe(true);

  expect(isThisCardWaiting(modifiedState, 8)).toBe(true);
  expect(isThisCardWaiting(modifiedState, 1)).toBe(false);
});

test(COMMAND_SENT + ' : clearStoryEstimate  ', () => {
  const roomId = uuid();
  const storyId = 'dc3c0809-2c6e-42fd-93d2-3ee538113f12';
  const userId = '3a7baa33-b516-40e0-b499-e3f85d023edd';
  const startingState = {...initialState()};

  startingState.room.roomId = roomId;
  startingState.users.ownUserId = userId;
  startingState.stories.selectedStoryId = storyId;
  startingState.estimations = {
    [storyId]: {
      [userId]: {value: 8}
    }
  };

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'clearStoryEstimate',
      payload: {
        storyId
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId,
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'clearStoryEstimate')).toBe(true);
  expect(isThisCardWaiting(modifiedState, 8)).toBe(true);
  expect(isThisCardWaiting(modifiedState, 1)).toBe(false);
});

test(COMMAND_SENT + ' : storyWaiting selectStory  ', () => {
  const roomId = uuid();
  const storyId = 'dc3c0809-2c6e-42fd-93d2-3ee538113f12';
  const storyId2 = 'second-story-id';
  const userId = '3a7baa33-b516-40e0-b499-e3f85d023edd';
  const startingState = {...initialState()};

  startingState.room.roomId = roomId;
  startingState.users.ownUserId = userId;
  startingState.stories = {
    [storyId]: {
      id: storyId
    },
    [storyId2]: {
      id: storyId2
    }
  };

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'selectStory',
      payload: {
        storyId: storyId2
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId,
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'selectStory')).toBe(true);
  expect(isThisStoryWaiting(modifiedState, storyId2)).toBe(true);
  expect(isThisStoryWaiting(modifiedState, storyId)).toBe(false);
});

test(COMMAND_SENT + ' : storyWaiting trashStory  ', () => {
  const roomId = uuid();
  const storyId = 'dc3c0809-2c6e-42fd-93d2-3ee538113f12';
  const storyId2 = 'second-story-id';
  const userId = '3a7baa33-b516-40e0-b499-e3f85d023edd';
  const startingState = {...initialState()};

  startingState.room.roomId = roomId;
  startingState.users.ownUserId = userId;
  startingState.stories = {
    [storyId]: {
      id: storyId
    },
    [storyId2]: {
      id: storyId2
    }
  };

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'trashStory',
      payload: {
        storyId: storyId2
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId,
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'trashStory')).toBe(true);
  expect(isThisStoryWaiting(modifiedState, storyId2)).toBe(true);
  expect(isThisStoryWaiting(modifiedState, storyId)).toBe(false);
});

test(COMMAND_SENT + ' : changeStory  ', () => {
  const roomId = uuid();
  const storyId = 'dc3c0809-2c6e-42fd-93d2-3ee538113f12';
  const userId = '3a7baa33-b516-40e0-b499-e3f85d023edd';
  const startingState = {...initialState()};

  startingState.room.roomId = roomId;
  startingState.users.ownUserId = userId;
  startingState.stories = {
    [storyId]: {
      id: storyId
    }
  };

  const action = {
    type: COMMAND_SENT,
    command: {
      name: 'changeStory',
      payload: {
        storyId,
        title: 'some'
      },
      id: '4aba05ab-be69-49d5-b034-a90579bf3ef6',
      userId,
      roomId
    }
  };

  const modifiedState = rootReducer(startingState, action);

  expect(hasMatchingPendingCommand(modifiedState, 'changeStory')).toBe(true);
  expect(isThisStoryEditFormWaiting(modifiedState, storyId)).toBe(true);
});
