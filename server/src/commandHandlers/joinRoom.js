var uuid = require('node-uuid').v4;

module.exports = {
  existingRoom: false,
  preCondition: undefined,
  fn: function joinRoom(room, command) {

    var newUser = {
      id: uuid(), // here we produce the userId for the new colleague
      username: command.payload.username
    };

    var joinedRoomEventPayload;

    if (!room.attributes) {
      room.applyEvent('roomCreated', {id: command.roomId, userId: newUser.id});
      room.applyEvent('moderatorSet', {moderatorId: newUser.id});

      // produce a "roomJoined" event for a new room
      // the current user (the creator) will be the only one in this room
      joinedRoomEventPayload = {
        userId: newUser.id,
        moderatorId: newUser.id,
        users: {
          [newUser.id]: newUser
        }
      };
    } else {
      // produce a "roomJoined" event for an existing room
      // this event must contain all information about the room, such that every joining user gets the current room state!
      joinedRoomEventPayload = {
        userId: newUser.id,
        moderatorId: room.attributes.get('moderatorId'),
        users: room.attributes.get('users').set(newUser.id, newUser).toJS(), // and all users that were already in that room
        stories: room.attributes.get('stories').toJS(),
        selectedStory: room.attributes.get('selectedStory')
      };

      // always make sure that room has a valid moderator. Or users are "Locked-out" from some functions...
      if (!room.attributes.get('moderatorId') || !room.attributes.getIn(['users', room.attributes.get('moderatorId')])) {
        room.applyEvent('moderatorSet', {moderatorId: newUser.id});
      }
    }

    room.applyEvent('joinedRoom', joinedRoomEventPayload);

    if (command.payload.username) {
      room.applyEvent('usernameSet', {
        userId: newUser.id,
        username: command.payload.username
      });
    }
  }

};
