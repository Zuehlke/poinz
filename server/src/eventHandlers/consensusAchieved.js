import {modifyStory} from './roomModifiers.js';

/**
 * Stores consensus estimation value (that everybody agreed on) on story.
 */
const consensusAchievedEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    consensus: eventPayload.value
  }));
};

export default consensusAchievedEventHandler;
