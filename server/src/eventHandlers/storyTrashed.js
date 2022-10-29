import {modifyStory} from './roomModifiers.js';

/**
 * Marks matching story as "trashed".  Story stays in room.
 */
const storyTrashedEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    trashed: true
  }));
};

export default storyTrashedEventHandler;
