var uuid = require('node-uuid').v4;

/**
 * A user joins a room.
 *
 * If the room does not yet exist, a "roomCreated" event is produced.
 * Produces also a "roomJoined" event (which contains the room state)
 *
 */
module.exports = {
  existingRoom: false,
  fn: function joinRoom(room, command) {

    // if user joins an existing room with a preset userId, the userId is handled like a "session" token.
    // Since we do not handle any sensitive data, it is known and accepted, that with a known userId one user can hijack the "session" of
    // another user
    // so we do not check if another socket/userId pair is already connected/present in that room

    var newUser = {
      id: command.payload.userId || uuid(), // client can cache/store userId and send it already with "joinRoom" command
      username: command.payload.username // client can cache/store username and send it already with "joinRoom" command
    };

    if (!room.existing) {
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

  // maybe user already exists in room (clients can reconnect with their userId)
  var matchingExistingUser = room.getIn(['users', newUser.id]);
  if (matchingExistingUser) {
    // use the already matching user (re-use already existing state like "visitor" flag etc.)
    // override the username if the "joinRoom" command contained a username.
    newUser = matchingExistingUser
      .set('username', newUser.username || matchingExistingUser.get('username'))
      .set('disconnected', false).toJS();
  }

  // produce a "roomJoined" event for an existing room
  // this event must contain all information about the room, such that every joining user gets the current room state!
  const joinedRoomEventPayload = {
    userId: newUser.id,
    users: room.get('users').set(newUser.id, newUser).toJS(), // and all users that were already in that room
    stories: room.get('stories').toJS(),
    selectedStory: room.get('selectedStory')
  };

  room.applyEvent('joinedRoom', joinedRoomEventPayload);
}
