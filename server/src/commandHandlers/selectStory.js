module.exports = {
  existingRoom: true,
  preCondition: function (room, command, userId) {
    // only moderator can select current story
    if (room.get('moderatorId') !== userId) {
      throw new Error('Only the moderator of room ' + room.get('id') + ' can select the current story.');
    }

    // check that id in payload is one of the stories in room
    if (!room.getIn(['stories', command.payload.id])) {
      throw new Error('Story ' + command.payload.id + ' cannot be selected. It is not part of room ' + room.get('id'));
    }
  },
  fn: function selectStory(room, command) {

    if (room.attributes.get('selectedStory') === command.payload.id) {
      // no change, no need to apply event
      return;
    }

    room.applyEvent('storySelected', {id: command.payload.id});
  }
};
