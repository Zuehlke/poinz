import {v4 as uuid} from 'uuid';

/**
 * A user joins a room.
 *
 * If the room does not yet exist, a "roomCreated" event is produced.
 * Produces also a "roomJoined" event (which contains the room state)
 *
 */
const joinRoomCommandHandler = {
  fn: (room, command) => {

    // if user joins an existing room with a preset userId, the userId is handled like a "session" token.
    // Since we do not handle any sensitive data, it is known and accepted, that with a known userId one user can hijack the "session" of
    // another user
    // so we do not check if another socket/userId pair is already connected/present in that room

    const userObject = getUserObject(room, command);

    // produce a "roomJoined" event for an existing room
    // this event must contain all information about the room, such that every joining user gets the current room state!
    const joinedRoomEventPayload = {
      userId: userObject.id,
      users: room.get('users').set(userObject.id, userObject).toJS(), // and all users that were already in that room
      stories: room.get('stories').toJS(),
      selectedStory: room.get('selectedStory')
    };

    room.applyEvent('joinedRoom', joinedRoomEventPayload);


    if (command.payload.username) {
      room.applyEvent('usernameSet', {
        userId: userObject.id,
        username: command.payload.username
      });
    }

    if (command.payload.email) {
      room.applyEvent('emailSet', {
        userId: userObject.id,
        email: command.payload.email
      });
    }
  }

};

export default joinRoomCommandHandler;

/**
 *
 * @param room
 * @param command
 * @return {{id: *, email: (string), username: *}|*}
 */
function getUserObject(room, command) {
  // maybe user already exists in room (clients can reconnect with their userId)
  let matchingExistingUser = room.getIn(['users', command.payload.userId]);

  if (matchingExistingUser) {
    // use the already matching user (re-use already existing state like "visitor" flag etc.)
    // override the username if the "joinRoom" command contained a username.

    matchingExistingUser = matchingExistingUser.toJS();

    if (command.payload.username) {
      matchingExistingUser.username = command.payload.username;
    }

    if (command.payload.email) {
      matchingExistingUser.email = command.payload.email;
    }

    matchingExistingUser.disconnected = false;

    return matchingExistingUser;
  } else {
    return {
      id: command.payload.userId || uuid(), // client can cache/store userId and send it already with "joinRoom" command
      username: command.payload.username,// client can cache/store username and send it already with "joinRoom" command
      email: command.payload.email // client can cache/store email and send it already with "joinRoom" command
    };
  }


}
