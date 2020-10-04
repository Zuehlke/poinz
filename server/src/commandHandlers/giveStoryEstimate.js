/**
 * A user gives his estimation for a certain story.
 * Users may only give estimations for the currently selected story.
 * A user that is marked as excluded (see toggleExclude/excludedFromEstimations)  cannot give estimations
 * As soon as all users (that can estimate) estimated the story, a "revealed" event is produced
 */
import {throwIfStoryIdNotFoundInRoom} from './commonPreconditions';

const schema = {
  allOf: [
    {
      $ref: 'command'
    },
    {
      properties: {
        payload: {
          type: 'object',
          properties: {
            storyId: {
              type: 'string',
              minLength: 1
            },
            value: {
              type: 'number'
            }
          },
          required: ['storyId', 'value'],
          additionalProperties: false
        }
      }
    }
  ]
};

const giveStoryEstimateCommandHandler = {
  schema,
  preCondition: (room, command, userId) => {
    const storyId = command.payload.storyId;

    if (room.selectedStory !== storyId) {
      throw new Error('Can only give estimation for currently selected story!');
    }

    throwIfStoryIdNotFoundInRoom(room, storyId);

    if (room.stories[storyId].revealed) {
      throw new Error('You cannot give an estimate for a story that was revealed!');
    }

    if (room.users[userId].excluded) {
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
  const possibleEstimationCount = countAllUsersThatCanEstimate(room);

  const estimations = {
    ...room.stories[storyId].estimations,
    [userId]: -1 // Add our user's estimation manually to the estimations, because our estimation might not yet be map (event will be applied later)
  };
  const estimationCount = Object.values(estimations).length;

  return estimationCount === possibleEstimationCount;
}

function allValidUsersEstimatedSame(room, cmdPayload, userId) {
  const estimations = room.stories[cmdPayload.storyId].estimations;
  estimations[userId] = cmdPayload.value; // Add our user's estimation manually to the estimationMap .. (event will be applied later)

  const estValues = Object.values(estimations);
  const firstValue = estValues[0];

  return estValues.every((est) => est === firstValue);
}

const countAllUsersThatCanEstimate = (room) =>
  Object.values(room.users || {})
    .filter((usr) => !usr.excluded)
    .filter((usr) => !usr.disconnected).length;

export default giveStoryEstimateCommandHandler;
