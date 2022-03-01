export const getCurrentSidebarIfAny = (state) => state.ui.sidebar;

export const isBacklogShown = (state) => !!state.ui.backlogShown;

export const hasApplause = (state) => !!state.ui.applause;

export const hasUnseenError = (state) => state.ui.unseenError;
