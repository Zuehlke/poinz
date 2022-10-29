import {modifyStory} from './roomModifiers.js';

/**
 * Removes a previously set estimation value on the given story for the given user
 */
const storyEstimateClearedEventHandler = (room, eventPayload, userId) => {
  return modifyStory(room, eventPayload.storyId, (story) => {
    const modifiedStory = {
      ...story,
      estimations: {
        ...story.estimations
      }
    };
    delete modifiedStory.estimations[userId];
    return modifiedStory;
  });
};

export default storyEstimateClearedEventHandler;
