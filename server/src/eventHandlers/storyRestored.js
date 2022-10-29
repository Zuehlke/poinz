/**
 * Resets "trashed" flag on matching story.
 * Flag will be "false" afterwards.
 */
import {modifyStory} from './roomModifiers.js';

const storyRestoredEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    trashed: false
  }));
};

export default storyRestoredEventHandler;
