/**
 * A user can exclude himself from estimations.
 * Emits event "excludedFromEstimations" or "includedInEstimations"  on toggle
 *
 * If user is marked as excluded, he cannot estimate stories.
 *
 */
const toggleExcludeCommandHandler = {
  preCondition: (room, command, userId) => {
    if (userId !== command.payload.userId) {
      throw new Error('Can only exclude or include own user from estimations');
    }
  },
  fn: (room, command) => {

    if(room.getIn(['users',command.payload.userId,'excluded'])){
      room.applyEvent('includedInEstimations', {userId: command.payload.userId});
    }else{
      room.applyEvent('excludedFromEstimations', {userId: command.payload.userId});
    }
  }
};

export default toggleExcludeCommandHandler;
