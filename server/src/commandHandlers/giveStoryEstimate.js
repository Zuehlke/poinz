var _ = require('lodash');

/**
 * A user gives his estimation for a certain story.
 * Users may only give estimations for the currently selected story.
 */
module.exports = {
  existingRoom: true,
  preCondition: function (room, command) {
    if (room.get('selectedStory') !== command.payload.storyId) {
      throw new Error('Can only give estimation for currently selected story!');
    }

    if (room.getIn(['stories', command.payload.storyId, 'allEstimatesGiven'])) {
      throw new Error('You cannot give an estimate for a story with "allEstimatesGiven" set!');
    }
  },
  fn: function giveStoryEstimate(room, command) {
    // currently estimation value is also sent to clients (hidden there)
    // user could "sniff" network traffic and see estimations of colleagues...
    // this could be improved in the future..
    room.applyEvent('storyEstimateGiven', command.payload);

    // now check if every user in the room did estimate the current story
    var usersThatHaveEstimateGiven = room.attributes.getIn(['stories', command.payload.storyId, 'estimations']).keySeq().toJS();
    usersThatHaveEstimateGiven.push(command.payload.userId);
    var allUsers = room.attributes.get('users').keySeq().toJS();

    if (usersThatHaveEstimateGiven.length <= allUsers.length && _.isEqual(usersThatHaveEstimateGiven.sort(), allUsers.sort())) {
      room.applyEvent('allEstimatesGiven', {
        storyId: command.payload.storyId
      });
    }
  }
};
