/**
 * Title and/or Description of story changed
 */
import {modifyStory} from './roomModifiers';

const storyChangedEventHandler = (room, eventPayload) => {
  // for now, the changeStory command must contain always both attributes (see validation schema)
  // so we can just overwrite both

  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    title: eventPayload.title,
    description: eventPayload.description
  }));
};

export default storyChangedEventHandler;
