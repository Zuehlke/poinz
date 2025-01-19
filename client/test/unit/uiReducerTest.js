import {
  BACKLOG_SIDEBAR_TOGGLED,
  SIDEBAR_SETTINGS,
  SIDEBAR_ACTIONLOG,
  SIDEBAR_HELP,
  toggleBacklogSidebar,
  toggleSidebar
} from '../../src/state/actions/uiStateActions';
import initialState from '../../src/state/initialState';
import rootReducer from '../../src/state/rootReducer';

test(BACKLOG_SIDEBAR_TOGGLED, () => {
  const startingState = initialState();

  // settings is currently shown, when backlog is openend, hide settings
  startingState.sidebar = SIDEBAR_SETTINGS;
  let modifiedState = rootReducer(startingState, toggleBacklogSidebar());
  expect(modifiedState.ui.backlogShown).toBe(true);
  expect(modifiedState.ui.sidebar).toBeFalsy();

  modifiedState = rootReducer(modifiedState, toggleBacklogSidebar());
  expect(modifiedState.ui.backlogShown).toBe(false);
  expect(modifiedState.ui.sidebar).toBeFalsy(); // still false
});

test('toggle sidebar', () => {
  let modifiedState = initialState();

  modifiedState.ui.unseenError = true;

  modifiedState = rootReducer(modifiedState, toggleSidebar(SIDEBAR_SETTINGS));
  expect(modifiedState.ui.sidebar).toBe(SIDEBAR_SETTINGS);
  expect(modifiedState.ui.unseenError).toBe(true);

  modifiedState.backlogShown = true;

  modifiedState = rootReducer(modifiedState, toggleSidebar(SIDEBAR_HELP));
  expect(modifiedState.ui.sidebar).toBe(SIDEBAR_HELP);
  expect(modifiedState.ui.unseenError).toBe(true);
  expect(modifiedState.ui.backlogShown).toBe(false);

  modifiedState = rootReducer(modifiedState, toggleSidebar(SIDEBAR_ACTIONLOG));
  expect(modifiedState.ui.sidebar).toBe(SIDEBAR_ACTIONLOG);
  expect(modifiedState.ui.unseenError).toBe(false);

  modifiedState = rootReducer(modifiedState, toggleSidebar(SIDEBAR_ACTIONLOG));
  expect(modifiedState.ui.sidebar).toBeUndefined();
});
