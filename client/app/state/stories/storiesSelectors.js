import {createSelector} from 'reselect';

export const getStoriesById = (state) => state.stories.storiesById;
export const getSelectedStoryId = (state) => state.stories.selectedStoryId;
export const getStoryById = (state, storyId) => state.stories.storiesById[storyId];

/**
 * Returns active stories as array. Never returns undefined.
 * @return {object[]}
 */
export const getActiveStories = createSelector([getStoriesById], (stories) =>
  stories ? Object.values(stories).filter((s) => !s.trashed) : []
);

/**
 * Returns trashed stories as array. Never returns undefined.
 */
export const getTrashedStories = createSelector([getStoriesById], (stories) =>
  stories ? Object.values(stories).filter((s) => s.trashed) : []
);

/**
 * Returns true if our room contains stories and a story is selected.
 * False otherwise
 */
export const isAStorySelected = createSelector(
  [getSelectedStoryId, getStoriesById],
  (selectedStoryId, stories) => stories && selectedStoryId && !!stories[selectedStoryId]
);

/**
 * Get the currently selected story.
 * Might return undefined!
 */
export const getSelectedStory = createSelector(
  [getSelectedStoryId, getStoriesById],
  (selectedStoryId, stories) => stories && selectedStoryId && stories[selectedStoryId]
);

/**
 * Returns true if our room contains stories, and a story is selected and this story was estimated with consensus (all values the same).
 * False otherwise
 */
export const hasSelectedStoryConsensus = createSelector(
  [getSelectedStory],
  (selectedStory) => selectedStory && hasStoryConsensus(selectedStory)
);

/**
 * technically not a selector. pass in the story (not the whole state)
 *
 * value could be "0" which is falsy, check for undefined
 *
 * @param {object} story
 * @return {boolean}
 */
export const hasStoryConsensus = (story) =>
  story.consensus !== undefined && story.consensus !== null;
