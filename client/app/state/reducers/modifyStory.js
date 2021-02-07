/**
 * Modify one story in the state
 *
 * @param state
 * @param storyId
 * @param {function} modifier Will be invoked with the matching story from the state (which can be undefined, if no such story is in the state)
 */
export default function modifyStory(state, storyId, modifier) {
  const modifiedStory = modifier(state.stories[storyId]);

  return {
    ...state,
    stories: {
      ...state.stories,
      [storyId]: modifiedStory
    }
  };
}
