import {createSelector} from 'reselect';

const getStories = (state) => state.stories;
const getOwnUserId = (state) => state.userId;
const getSelectedStoryId = (state) => state.selectedStory;
const getEstimations = (state) => state.estimations;

/**
 * Returns active stories as array. Never returns undefined.
 */
export const getActiveStories = createSelector([getStories], (stories) =>
  stories ? Object.values(stories).filter((s) => !s.trashed) : []
);

/**
 * Returns trashed stories as array. Never returns undefined.
 */
export const getTrashedStories = createSelector([getStories], (stories) =>
  stories ? Object.values(stories).filter((s) => s.trashed) : []
);

/**
 * Returns own estimate for the currently selectedStory. Can return undefined.
 */
export const getOwnEstimate = createSelector(
  [getSelectedStoryId, getEstimations, getOwnUserId],
  (selectedStoryId, estimations, ownUserId) =>
    estimations && estimations[selectedStoryId] && estimations[selectedStoryId][ownUserId]
);

/**
 * Returns true if our room contains stories and a story is selected.
 * False otherwise
 */
export const isAStorySelected = createSelector(
  [getSelectedStoryId, getStories],
  (selectedStoryId, stories) => stories && selectedStoryId && !!stories[selectedStoryId]
);

/**
 * Returns true if our room contains stories, and a story is selected and this story was estimated with consensus (all values the same).
 * False otherwise
 */
export const hasSelectedStoryConsensus = createSelector(
  [getSelectedStoryId, getStories],
  (selectedStoryId, stories) =>
    stories &&
    selectedStoryId &&
    !!stories[selectedStoryId] &&
    stories[selectedStoryId].consensus !== null &&
    stories[selectedStoryId].consensus !== undefined
);

/**
 *
 */
export const getEstimationsForCurrentlySelectedStory = createSelector(
  [getSelectedStoryId, getEstimations],
  (selectedStoryId, estimations) =>
    estimations && estimations[selectedStoryId] ? estimations[selectedStoryId] : {}
);

/**
 * Find the id of the "next story to estimate":
 * - Look through the backlog of active (=untrashed) stories, find the first one that is not revealed.
 * - If all are revealed, find the first one without consensus.
 * - Else, return undefined.
 *
 */
export const findNextStoryIdToEstimate = createSelector(
  [getSelectedStoryId, getStories],
  (selectedStoryId, stories) => {
    const storyArray = Object.values(stories);

    const nextUnrevealedStory = storyArray.find(
      (stry) => !stry.trashed && !stry.revealed && stry.id !== selectedStoryId
    );
    if (nextUnrevealedStory) {
      return nextUnrevealedStory.id;
    }

    const nextStoryWithoutConsensus = storyArray.find(
      (stry) => !stry.trashed && !stry.consensus && stry.id !== selectedStoryId
    );
    if (nextStoryWithoutConsensus) {
      return nextStoryWithoutConsensus.id;
    }
  }
);
