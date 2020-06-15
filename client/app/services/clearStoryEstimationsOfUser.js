/**
 * Removes all the estimations of the given user from all the stories
 * This is done, when a user leaves the room.
 *
 * @param {object} storiesObjectFromReduxState
 * @param {string} userId
 * @return {object} the modified "stories" object
 */
export default function clearStoryEstimationsOfUser(storiesObjectFromReduxState, userId) {
  const storyArray = Object.values(storiesObjectFromReduxState);

  return storyArray.reduce((result, currentStory) => {
    const estimationArrayOfCurrentStory = Object.keys(currentStory.estimations);
    const estimationOfUser = estimationArrayOfCurrentStory.find((uid) => userId === uid);

    if (!estimationOfUser) {
      result[currentStory.id] = currentStory;
      return result;
    }

    const modifiedEstimations = {...currentStory.estimations};
    delete modifiedEstimations[userId];
    result[currentStory.id] = {
      ...currentStory,
      estimations: modifiedEstimations
    };
    return result;
  }, {});
}
