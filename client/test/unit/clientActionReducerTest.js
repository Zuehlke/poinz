import {v4 as uuid} from 'uuid';

import {
  CANCEL_EDIT_STORY,
  COMMAND_SENT,
  EDIT_STORY,
  EVENT_RECEIVED,
  HIDE_NEW_USER_HINTS,
  LOCATION_CHANGED,
  SET_LANGUAGE,
  STATUS_FETCHED,
  TOGGLE_BACKLOG,
  TOGGLE_LOG,
  TOGGLE_USER_MENU,
  SHOW_TRASH,
  HIDE_TRASH
} from '../../app/actions/types';
import initialState from '../../app/store/initialState';
import clientActionReducer from '../../app/services/clientActionReducer';
import {
  cancelEditStory,
  editStory,
  hideNewUserHints,
  hideTrash,
  setLanguage,
  showTrash,
  toggleBacklog,
  toggleLog,
  toggleUserMenu
} from '../../app/actions';

test(COMMAND_SENT, () => {
  const startingState = initialState();

  const cmdId1 = uuid();
  const cmdId2 = uuid();

  let modifiedState = clientActionReducer(startingState, {
    type: COMMAND_SENT,
    command: {
      id: cmdId1,
      name: 'superCommand',
      payload: {
        some: 'more data'
      }
    }
  });

  modifiedState = clientActionReducer(modifiedState, {
    type: COMMAND_SENT,
    command: {
      id: cmdId2,
      name: 'secondSuperCommand'
    }
  });

  expect(modifiedState.pendingCommands).toEqual({
    [cmdId1]: {
      id: cmdId1,
      name: 'superCommand',
      payload: {
        some: 'more data'
      }
    },
    [cmdId2]: {
      id: cmdId2,
      name: 'secondSuperCommand'
    }
  });
});

test(EVENT_RECEIVED, () => {
  const cmdId1 = uuid();
  const cmdId2 = uuid();

  const startingState = {
    ...initialState(),
    pendingCommands: {
      [cmdId1]: {
        id: cmdId1,
        name: 'superCommand',
        payload: {
          some: 'more data'
        }
      },
      [cmdId2]: {
        id: cmdId2,
        name: 'secondSuperCommand'
      }
    }
  };

  let modifiedState = clientActionReducer(startingState, {
    type: EVENT_RECEIVED,
    correlationId: 'does-not-match',
    eventName: 'usernameSet'
  });
  expect(Object.values(modifiedState.pendingCommands).length).toBe(2); // still both commands

  modifiedState = clientActionReducer(modifiedState, {
    type: EVENT_RECEIVED,
    correlationId: cmdId1,
    eventName: 'usernameSet'
  });
  expect(modifiedState.pendingCommands[cmdId1]).toBeUndefined();
  expect(modifiedState.pendingCommands[cmdId2]).toBeDefined();

  modifiedState = clientActionReducer(modifiedState, {
    type: EVENT_RECEIVED,
    correlationId: cmdId2,
    eventName: 'usernameSet'
  });

  expect(modifiedState.pendingCommands[cmdId2]).toBeUndefined();
});

test(TOGGLE_BACKLOG, () => {
  const startingState = initialState();

  // usermenu (settings) is currently shown, hide it
  startingState.userMenuShown = true;
  let modifiedState = clientActionReducer(startingState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(true);
  expect(modifiedState.userMenuShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(false);
  expect(modifiedState.userMenuShown).toBe(false);

  // if action log is currently shown, hide it
  startingState.logShown = true;
  modifiedState = clientActionReducer(startingState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(true);
  expect(modifiedState.logShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(false);
  expect(modifiedState.logShown).toBe(false);
});

test(TOGGLE_USER_MENU, () => {
  const startingState = initialState();

  // if backlog (stories) is currently shown, hide it
  startingState.backlogShown = true;
  let modifiedState = clientActionReducer(startingState, toggleUserMenu());
  expect(modifiedState.userMenuShown).toBe(true);
  expect(modifiedState.backlogShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleUserMenu());
  expect(modifiedState.userMenuShown).toBe(false);
  expect(modifiedState.backlogShown).toBe(false);

  // if action log is currently shown, hide it
  startingState.logShown = true;
  modifiedState = clientActionReducer(startingState, toggleUserMenu());
  expect(modifiedState.userMenuShown).toBe(true);
  expect(modifiedState.logShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleUserMenu());
  expect(modifiedState.userMenuShown).toBe(false);
  expect(modifiedState.logShown).toBe(false);
});

test(TOGGLE_LOG, () => {
  const startingState = initialState();

  // if backlog (stories) is currently shown, hide it
  startingState.backlogShown = true;
  let modifiedState = clientActionReducer(startingState, toggleLog());
  expect(modifiedState.logShown).toBe(true);
  expect(modifiedState.backlogShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleLog());
  expect(modifiedState.logShown).toBe(false);
  expect(modifiedState.backlogShown).toBe(false);

  // usermenu (settings) is currently shown, hide it
  startingState.userMenuShown = true;
  modifiedState = clientActionReducer(startingState, toggleLog());
  expect(modifiedState.logShown).toBe(true);
  expect(modifiedState.userMenuShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleLog());
  expect(modifiedState.logShown).toBe(false);
  expect(modifiedState.userMenuShown).toBe(false);
});

test(EDIT_STORY + ' and ' + CANCEL_EDIT_STORY, () => {
  const storyId1 = uuid();
  const storyId2 = uuid();

  const startingState = {
    ...initialState(),
    stories: {
      [storyId1]: {},
      [storyId2]: {}
    }
  };

  let modifiedState = clientActionReducer(startingState, editStory(storyId1));
  expect(modifiedState.stories[storyId1].editMode).toBe(true);

  // multiple stories can be in edit mode simultaneously
  modifiedState = clientActionReducer(modifiedState, editStory(storyId2));
  expect(modifiedState.stories[storyId1].editMode).toBe(true);
  expect(modifiedState.stories[storyId2].editMode).toBe(true);

  // cancel edit mode for story 1
  modifiedState = clientActionReducer(modifiedState, cancelEditStory(storyId1));
  expect(modifiedState.stories[storyId1].editMode).toBe(false);
  expect(modifiedState.stories[storyId2].editMode).toBe(true);
});

test(SET_LANGUAGE, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, setLanguage('someLangCode'));
  expect(modifiedState.language).toEqual('someLangCode');
});

test(HIDE_NEW_USER_HINTS, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, hideNewUserHints());
  expect(modifiedState.hideNewUserHints).toBe(true);
});

test(STATUS_FETCHED, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, {
    type: STATUS_FETCHED,
    status: {some: 'data'}
  });
  expect(modifiedState.appStatus).toEqual({
    some: 'data'
  });
});

test(LOCATION_CHANGED, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, {
    type: LOCATION_CHANGED,
    pathname: 'somePathName'
  });
  expect(modifiedState.pathname).toEqual('somePathName');
});

test(SHOW_TRASH + ' and ' + HIDE_TRASH, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, showTrash());
  expect(modifiedState.trashShown).toBe(true);
  modifiedState = clientActionReducer(modifiedState, hideTrash());
  expect(modifiedState.trashShown).toBe(false);
});
