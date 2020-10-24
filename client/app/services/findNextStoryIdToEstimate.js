/**
 * Find the id of the "next story to estimate":
 * - Look through the backlog of active (=untrashed) stories, find the first one that is not revealed.
 * - If all are revealed, find the first one without consensus.
 * - Else, return undefined.
 *
 * @param {object} state the Redux state
 */
export default function findNextStoryIdToEstimate(state) {
  const storyArray = Object.values(state.stories);

  const nextUnrevealedStory = storyArray.find(
    (stry) => !stry.trashed && !stry.revealed && stry.id !== state.selectedStory
  );
  if (nextUnrevealedStory) {
    return nextUnrevealedStory.id;
  }

  const nextStoryWithoutConsensus = storyArray.find(
    (stry) => !stry.trashed && !stry.consensus && stry.id !== state.selectedStory
  );
  if (nextStoryWithoutConsensus) {
    return nextStoryWithoutConsensus.id;
  }
}
