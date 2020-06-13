/**
 * A user can exclude himself from estimations.
 * Emits event "excludedFromEstimations" or "includedInEstimations"  on toggle
 *
 * If user is marked as excluded, he cannot estimate stories.
 *
 */
const toggleExcludeCommandHandler = {
  fn: (room, command, userId) => {
    if (room.getIn(['users', userId, 'excluded'])) {
      room.applyEvent('includedInEstimations', {});
    } else {
      room.applyEvent('excludedFromEstimations', {});
    }
  }
};

export default toggleExcludeCommandHandler;
