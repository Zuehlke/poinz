/**
 * Estimations for the given story were revealed.
 * This happens automatically if all users that can estimate (not marked as excluded, not disconnected) did estimate the current story (i.e. if the last user gives his estimate)
 * This happens if a user manually reveals. (this is helpful, if someone is AFK and team wants to proceed with the estimation meeting)
 */
import {modifyStory} from './roomModifiers';

const revealedEventHandler = (room, eventPayload) => {
  return modifyStory(room, eventPayload.storyId, (story) => ({
    ...story,
    revealed: true
  }));
};

export default revealedEventHandler;
