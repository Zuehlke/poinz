import {createSelector} from 'reselect';

import {getOwnUserId} from '../users/usersSelectors';
import {getSelectedStoryId, getStoriesById} from '../stories/storiesSelectors';

export const getEstimations = (state) => state.estimations;

/**
 * Returns own estimate for the currently selectedStory. Can return undefined.
 */
export const getOwnEstimate = createSelector(
  [getSelectedStoryId, getEstimations, getOwnUserId],
  (selectedStoryId, estimations, ownUserId) =>
    estimations?.[selectedStoryId] && estimations[selectedStoryId][ownUserId]
);

/**
 *
 */
export const getEstimationsForCurrentlySelectedStory = createSelector(
  [getSelectedStoryId, getEstimations],
  (selectedStoryId, estimations) =>
    estimations?.[selectedStoryId] ? estimations[selectedStoryId] : {}
);

export const isThisStoryEstimated = (state, storyId) => {
  const estimations = getEstimations(state);
  return estimations[storyId] && Object.keys(estimations[storyId]).length > 0;
};

/**
 * Find the id of the "next story to estimate":
 * - Look through the backlog of active (=untrashed) stories, find the first one that is not revealed.
 * - If all are revealed, find the first one without consensus.
 * - Else, return undefined.
 *
 */
export const findNextStoryIdToEstimate = createSelector(
  [getSelectedStoryId, getStoriesById],
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
