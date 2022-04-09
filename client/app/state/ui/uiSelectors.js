import {MAINVIEW_ROOM} from '../actions/uiStateActions';

export const getCurrentSidebarIfAny = (state) => state.ui.sidebar;

export const getCurrentMainView = (state) => state.ui.mainView || MAINVIEW_ROOM;

export const isBacklogShown = (state) => !!state.ui.backlogShown;

export const hasApplause = (state) => !!state.ui.applause;

export const hasUnseenError = (state) => state.ui.unseenError;

export const getHighlightedStoryId = (state) => state.ui.highlightedStoryId;
