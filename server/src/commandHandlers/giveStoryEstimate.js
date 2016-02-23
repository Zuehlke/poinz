var _ = require('lodash');

/**
 * A user gives his estimation for a certain story.
 * Users may only give estimations for the currently selected story.
 * A user that is marked as visitor cannot give estimations
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    if (command.payload.userId !== userId) {
      throw new Error('Can only give estimate if userId in command payload matches!');
    }

    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only give estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'allEstimatesGiven'])) {
      throw new Error('You cannot give an estimate for a story with "allEstimatesGiven" set!');
    }

    if (room.getIn(['users', userId, 'visitor'])) {
      throw new Error('Visitors cannot give estimations!');
    }
  },
  fn: function giveStoryEstimate(room, command) {
    // currently estimation value is also sent to clients (hidden there)
    // user could "sniff" network traffic and see estimations of colleagues...
    // this could be improved in the future.. (e.g. not send value with "storyEstimateGiven" -> but send all values later with "allEstimatesGiven" )
    room.applyEvent('storyEstimateGiven', command.payload);

    // now check if every user in the room (that is not marked as visitor and is not disconnected)  did estimate the current story
    var usersThatHaveEstimateGiven = room.attributes.getIn(['stories', command.payload.storyId, 'estimations']).keySeq().toJS();
    usersThatHaveEstimateGiven.push(command.payload.userId);
    var allUsersThatCanEstimate = room.attributes.get('users')
      .filter(usr => !usr.get('visitor'))
      .filter(usr => !usr.get('disconnected'))
      .keySeq().toJS();

    if (usersThatHaveEstimateGiven.length <= allUsersThatCanEstimate.length && _.isEqual(usersThatHaveEstimateGiven.sort(), allUsersThatCanEstimate.sort())) {
      room.applyEvent('allEstimatesGiven', {
        storyId: command.payload.storyId
      });
    }
  }
};
