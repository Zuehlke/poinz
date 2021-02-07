import {v4 as uuid} from 'uuid';

import initialState from '../../../app/state/initialState';
import clientActionReducer from '../../../app/state/reducers/clientActionReducer';

import {EVENT_RECEIVED, ROOM_STATE_FETCHED} from '../../../app/state/actions/eventActions';

import {
  CANCEL_EDIT_STORY,
  EDIT_STORY,
  HIDE_NEW_USER_HINTS,
  HIDE_TRASH,
  SET_LANGUAGE,
  SHOW_TRASH,
  TOGGLE_BACKLOG,
  SIDEBAR_SETTINGS,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_HELP,
  toggleBacklog,
  hideNewUserHints,
  toggleSidebar,
  editStory,
  cancelEditStory,
  setLanguage,
  showTrash,
  hideTrash
} from '../../../app/state/actions/uiStateActions';
import {COMMAND_SENT, LOCATION_CHANGED} from '../../../app/state/actions/commandActions';

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

  // settings is currently shown, when backlog is openend, hide settings
  startingState.sidebar = SIDEBAR_SETTINGS;
  let modifiedState = clientActionReducer(startingState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(true);
  expect(modifiedState.sidebar).toBeFalsy();

  modifiedState = clientActionReducer(modifiedState, toggleBacklog());
  expect(modifiedState.backlogShown).toBe(false);
  expect(modifiedState.sidebar).toBeFalsy(); // still false
});

test('toggle sidebar', () => {
  const startingState = initialState();

  let modifiedState = startingState;

  modifiedState.unseenError = true;

  modifiedState = clientActionReducer(modifiedState, toggleSidebar(SIDEBAR_SETTINGS));
  expect(modifiedState.sidebar).toBe(SIDEBAR_SETTINGS);
  expect(modifiedState.unseenError).toBe(true);

  modifiedState.backlogShown = true;

  modifiedState = clientActionReducer(modifiedState, toggleSidebar(SIDEBAR_HELP));
  expect(modifiedState.sidebar).toBe(SIDEBAR_HELP);
  expect(modifiedState.unseenError).toBe(true);
  expect(modifiedState.backlogShown).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleSidebar(SIDEBAR_ACTIONLOG));
  expect(modifiedState.sidebar).toBe(SIDEBAR_ACTIONLOG);
  expect(modifiedState.unseenError).toBe(false);

  modifiedState = clientActionReducer(modifiedState, toggleSidebar(SIDEBAR_ACTIONLOG));
  expect(modifiedState.sidebar).toBeUndefined();
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

  const modifiedState = clientActionReducer(startingState, setLanguage('someLangCode'));
  expect(modifiedState.language).toEqual('someLangCode');
  expect(modifiedState.translator).not.toBe(startingState.translator); // make sure "translator" changes, so that components do re-render
});

test(HIDE_NEW_USER_HINTS, () => {
  const startingState = initialState();

  let modifiedState = clientActionReducer(startingState, hideNewUserHints());
  expect(modifiedState.hideNewUserHints).toBe(true);
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

test(ROOM_STATE_FETCHED, () => {
  const startingState = initialState();
  const roomId = uuid();
  startingState.roomId = roomId;

  const fetchedRoomState = {
    autoReveal: true,
    id: roomId,
    selectedStory: '00ee44f1-79f8-4467-bfd3-ddc2d87735fc',
    stories: [
      {
        id: '00ee44f1-79f8-4467-bfd3-ddc2d87735fc',
        title: 'first',
        estimations: {
          'dc37a738-dbe8-4923-91c5-1b48ab1b3b2d': 3
        },
        createdAt: 1604385944454
      },
      {
        id: '764343f0-6cdc-4abf-8bfc-c604b63ac633',
        title: 'second',
        estimations: {
          '60b84426-3446-470d-a316-0e2ef234f6ff': 5
        },
        createdAt: 1604385947968
      }
    ],
    users: [
      {
        disconnected: false,
        id: 'dc37a738-dbe8-4923-91c5-1b48ab1b3b2d',
        avatar: 2,
        username: 'Foxy'
      },
      {
        id: '60b84426-3446-470d-a316-0e2ef234f6ff',
        username: 'Sergio',
        email: 'xeronimus@gmail.com',
        avatar: 9,
        disconnected: false,
        excluded: false,
        emailHash: '349256fe3ca7a83b273f4c609c6a2a87'
      }
    ],
    passwordProtected: true,
    cardConfig: [{label: 'some', value: '1', color: 'red'}]
  };

  let modifiedState = clientActionReducer(startingState, {
    type: ROOM_STATE_FETCHED,
    room: fetchedRoomState
  });

  // users is an object, indexed by userId
  expect(modifiedState.users[fetchedRoomState.users[0].id]).toEqual({
    avatar: 2,
    disconnected: false,
    id: 'dc37a738-dbe8-4923-91c5-1b48ab1b3b2d',
    username: 'Foxy'
  });

  // stories is an object, indexed by storyId
  expect(modifiedState.stories[fetchedRoomState.stories[0].id]).toEqual({
    createdAt: 1604385944454,
    id: '00ee44f1-79f8-4467-bfd3-ddc2d87735fc',
    title: 'first'
    // no estimations property here. removed by reducer
  });

  // estimations is a separate object
  expect(modifiedState.estimations).toEqual({
    [fetchedRoomState.stories[0].id]: {
      [fetchedRoomState.users[0].id]: 3
    },
    [fetchedRoomState.stories[1].id]: {
      [fetchedRoomState.users[1].id]: 5
    }
  });

  expect(modifiedState.cardConfig.length).toBe(1);

  expect(modifiedState.passwordProtected).toBe(true);
});
