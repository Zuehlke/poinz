import {modifyStory} from './roomModifiers.js';

/**
 * Stores consensus estimation value on story.
 * Technically the same as "consensusAchieved" event, but this is used for the "setStoryValue" command. and has a different semantic.
 */
const storyValueSetEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    consensus: eventPayload.value,
    revealed: true
  }));
};

export default storyValueSetEventHandler;
