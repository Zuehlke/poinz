var uuid = require('node-uuid').v4;

/**
 * A user joins a room.
 *
 */
module.exports = {
  existingRoom: false,
  fn: function joinRoom(room, command) {

    // if user joins an existing room with a preset userId, the userId is handled like a "session" token.
    // Since we do not handle any sensitive data, it is known and accepted, that with a known userId one user can highjack the "session" of
    // another user
    // so we do not check if another socket/userId pair is already connected/present in that room

    var newUser = {
      id: command.payload.userId || uuid(), // client can cache/store userId and send it already with "joinRoom" command
      username: command.payload.username // client can cache/store username and send it already with "joinRoom" command
    };

    if (!room.attributes) {
      handleNewRoom(room, command, newUser);
    } else {
      handleExistingRoom(room, newUser);
    }

    if (command.payload.username) {
      room.applyEvent('usernameSet', {
        userId: newUser.id,
        username: command.payload.username
      });
    }
  }

};


function handleNewRoom(room, command, newUser) {
  room.applyEvent('roomCreated', {id: command.roomId, userId: newUser.id});

  // produce a "roomJoined" event for a new room
  // the current user (the creator) will be the only one in this room
  const joinedRoomEventPayload = {
    userId: newUser.id,
    users: {
      [newUser.id]: newUser
    }
  };
  room.applyEvent('joinedRoom', joinedRoomEventPayload);
}

function handleExistingRoom(room, newUser) {
  // produce a "roomJoined" event for an existing room
  // this event must contain all information about the room, such that every joining user gets the current room state!
  const joinedRoomEventPayload = {
    userId: newUser.id,
    users: room.attributes.get('users').set(newUser.id, newUser).toJS(), // and all users that were already in that room
    stories: room.attributes.get('stories').toJS(),
    selectedStory: room.attributes.get('selectedStory')
  };

  room.applyEvent('joinedRoom', joinedRoomEventPayload);
}
