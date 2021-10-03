/**
 * Stores the given estimation value on the story for the given user
 */
import {modifyStory} from './roomModifiers';

const storyEstimateGivenEventHandler = (room, eventPayload, userId) => {
  let modifiedRoom = modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    estimations: {
      ...story.estimations,
      [userId]: eventPayload.value
    }
  }));

  if (eventPayload.confidence) {
    modifiedRoom = modifyStory(modifiedRoom, eventPayload.storyId, (story) => ({
      ...story,
      estimationsConfidence: {
        ...story.estimationsConfidence,
        [userId]: eventPayload.confidence
      }
    }));
  }
  return modifiedRoom;
};

export default storyEstimateGivenEventHandler;
