/**
 * Emits event "excludedFromEstimations" or "includedInEstimations"  on toggle
 *
 * (If user is marked as excluded, he cannot estimate stories.)
 *
 */
import {throwIfUserIdNotFoundInRoom} from './commonPreconditions';

const toggleExcludeCommandHandler = {
  preCondition: (room, command, userId) => {
    throwIfUserIdNotFoundInRoom(room, userId);
  },
  fn: (room, command, userId) => {
    if (room.getIn(['users', userId, 'excluded'])) {
      room.applyEvent('includedInEstimations', {});
    } else {
      room.applyEvent('excludedFromEstimations', {});
    }
  }
};

export default toggleExcludeCommandHandler;
