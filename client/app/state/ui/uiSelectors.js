/**
 *
 * @param state
 * @return {function} The translator function "t"
 */
export const getTranslator = (state) => state.ui.translator;

export const getCurrentSidebarIfAny = (state) => state.ui.sidebar;

export const isBacklogShown = (state) => !!state.ui.backlogShown;

export const hasApplause = (state) => !!state.ui.applause;

export const getLanguage = (state) => state.ui.language;

export const hasUnseenError = (state) => state.ui.unseenError;
