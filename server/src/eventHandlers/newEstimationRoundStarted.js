import {modifyStory} from './roomModifiers.js';

/**
 * Clears all estimations on story, sets "revealed" flag to false and erases "consensus"
 */
const newEstimationRoundStartedEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    estimations: {},
    revealed: false,
    consensus: undefined
  }));
};

export default newEstimationRoundStartedEventHandler;
