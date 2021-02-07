import clientSettingsStore from '../../services/clientSettingsStore';

/* TYPES */
export const CANCEL_EDIT_STORY = 'CANCEL_EDIT_STORY';
export const EDIT_STORY = 'EDIT_STORY';
export const HIDE_NEW_USER_HINTS = 'HIDE_NEW_USER_HINTS';
export const SHOW_TRASH = 'SHOW_TRASH';
export const HIDE_TRASH = 'HIDE_TRASH';
export const HIGHLIGHT_STORY = 'HIGHLIGHT_STORY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const TOGGLE_BACKLOG = 'TOGGLE_BACKLOG'; // toggles the visibility of the story backlog
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'; // toggles the visibility of the righthand sidebar (could be either settings, action log or help)
export const TOGGLE_MARK_FOR_KICK = 'TOGGLE_MARK_FOR_KICK';

/* ACTION CREATORS */
export const toggleBacklog = () => ({type: TOGGLE_BACKLOG});
export const showTrash = () => ({type: SHOW_TRASH});
export const hideTrash = () => ({type: HIDE_TRASH});
export const highlightStory = (storyId) => ({type: HIGHLIGHT_STORY, storyId});
export const editStory = (storyId) => ({type: EDIT_STORY, storyId});
export const cancelEditStory = (storyId) => ({type: CANCEL_EDIT_STORY, storyId});
export const toggleMarkForKick = (userId) => ({type: TOGGLE_MARK_FOR_KICK, userId});
export const setLanguage = (language) => {
  clientSettingsStore.setPresetLanguage(language);
  return {type: SET_LANGUAGE, language};
};
export const hideNewUserHints = () => {
  clientSettingsStore.setHideNewUserHints(true);
  return {type: HIDE_NEW_USER_HINTS};
};
export const toggleSidebar = (sidebarKey) => ({type: TOGGLE_SIDEBAR, sidebarKey});
export const SIDEBAR_HELP = 'HELP';
export const SIDEBAR_SETTINGS = 'SETTINGS';
export const SIDEBAR_ACTIONLOG = 'ACTIONLOG';
