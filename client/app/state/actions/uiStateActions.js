import clientSettingsStore from '../clientSettingsStore';

/* TYPES */
export const STORY_EDIT_MODE_ENTERED = 'STORY_EDIT_MODE_ENTERED';
export const STORY_EDIT_MODE_CANCELLED = 'STORY_EDIT_MODE_CANCELLED';
export const HIDE_NEW_USER_HINTS = 'HIDE_NEW_USER_HINTS';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const BACKLOG_SIDEBAR_TOGGLED = 'BACKLOG_SIDEBAR_TOGGLED'; // toggles the visibility of the story backlog
export const SIDEBAR_TOGGLED = 'SIDEBAR_TOGGLED'; // toggles the visibility of the righthand sidebar (could be either settings, action log or help)

/* ACTION CREATORS */

/**
 * in mobile view, the backlog on the let hand side is toggleable. ("hamburger icon")
 */
export const toggleBacklogSidebar = () => ({type: BACKLOG_SIDEBAR_TOGGLED});

/**
 * Enter "edit mode" for a story. Display the edit form instead of text+description.
 * This needs to be on the redux state, we only want to disable edit mode if "storyChanged" event is received.
 */
export const editStory = (storyId) => ({type: STORY_EDIT_MODE_ENTERED, storyId});
export const cancelEditStory = (storyId) => ({type: STORY_EDIT_MODE_CANCELLED, storyId});

/**
 * set the frontend language
 */
export const setLanguage = (language) => {
  clientSettingsStore.setPresetLanguage(language);
  return {type: SET_LANGUAGE, language};
};
export const hideNewUserHints = () => {
  clientSettingsStore.setHideNewUserHints(true);
  return {type: HIDE_NEW_USER_HINTS};
};
export const toggleSidebar = (sidebarKey) => ({type: SIDEBAR_TOGGLED, sidebarKey});
export const SIDEBAR_HELP = 'HELP';
export const SIDEBAR_SETTINGS = 'SETTINGS';
export const SIDEBAR_ACTIONLOG = 'ACTIONLOG';
