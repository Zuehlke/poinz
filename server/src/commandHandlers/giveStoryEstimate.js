/**
 * A user gives his estimation for a certain story.
 * Users may only give estimations for the currently selected story.
 * A user that is marked as excluded (see toggleExclude/excludedFromEstimations)  cannot give estimations
 * As soon as all users (that can estimate) estimated the story, a "revealed" event is produced
 */
const giveStoryEstimateCommandHandler = {
  preCondition: (room, command, userId) => {
    const storyId = command.payload.storyId;

    if (room.get('selectedStory') !== storyId) {
      throw new Error('Can only give estimation for currently selected story!');
    }

    if (room.getIn(['stories', storyId, 'revealed'])) {
      throw new Error('You cannot give an estimate for a story that was revealed!');
    }

    if (room.getIn(['users', userId, 'excluded'])) {
      throw new Error('Users that are excluded from estimations cannot give estimations!');
    }
  },
  fn: (room, command, userId) => {
    // currently estimation value is also sent to clients (hidden there)
    // user could "sniff" network traffic and see estimations of colleagues...
    // this could be improved in the future.. (e.g. not send value with "storyEstimateGiven" -> but send all values later with "revealed" )
    room.applyEvent('storyEstimateGiven', command.payload);

    if (allValidUsersEstimated(room, command.payload.storyId, userId)) {
      room.applyEvent('revealed', {
        storyId: command.payload.storyId,
        manually: false
      });

      if (allValidUsersEstimatedSame(room, command.payload, userId)) {
        room.applyEvent('consensusAchieved', {
          storyId: command.payload.storyId,
          value: command.payload.value
        });
      }
    }
  }
};

/**
 * checks if every user in the room (that is not marked as excluded and is not disconnected)  did estimate the current story
 *
 * @param room
 * @param storyId
 * @param userId
 * @returns {boolean}
 */
function allValidUsersEstimated(room, storyId, userId) {
  const possibleEstimationCount = getAllUsersThatCanEstimate(room).keySeq().size;

  let estimations = room.getIn(['stories', storyId, 'estimations']);
  // Add our user's estimation manually to the estimationMap with a value of -1 (value does not matter here), because user's estimation might not yet be in map (event will be applied later)
  estimations = estimations.set(userId, -1);
  const estimationCount = estimations.size;

  return estimationCount === possibleEstimationCount;
}

function allValidUsersEstimatedSame(room, cmdPayload, userId) {
  let estimations = room.getIn(['stories', cmdPayload.storyId, 'estimations']);
  // Add our user's estimation manually to the estimationMap .. (event will be applied later)
  estimations = estimations.set(userId, cmdPayload.value);

  const estValues = estimations.valueSeq();
  const firstValue = estValues.get(0);

  return estValues.every((est) => est === firstValue);
}

function getAllUsersThatCanEstimate(room) {
  return room
    .get('users')
    .filter((usr) => !usr.get('excluded'))
    .filter((usr) => !usr.get('disconnected'));
}

export default giveStoryEstimateCommandHandler;
