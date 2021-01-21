import defaultCardConfig from '../defaultCardConfig';
import {calcEmailHash} from './setEmail';
import {modifyUser} from '../eventHandlers/roomModifiers';
import hashRoomPassword from './hashRoomPassword';

/**
 * A user joins a room.
 *
 * Two scenarios:  either the room exists already or the room with the given id does not exist yet.
 *
 * If the room does not yet exist, an additional "roomCreated" event is produced (as the first event).
 * Produces also a "roomJoined" event (which contains the room state).
 * Produces also events for additional properties if they are preset "usernameSet", "emailSet", "excludedFromEstimations".
 *
 */

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
            username: {
              type: 'string',
              format: 'username'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            avatar: {
              type: 'number'
            },
            password: {
              type: 'string',
              minLength: 3,
              maxLength: 50
            }
          },
          additionalProperties: false
        }
      }
    }
  ]
};

const joinRoomCommandHandler = {
  canCreateRoom: true,
  skipUserIdRoomCheck: true, // will not check whether userId is part of the room.  for most other commands this is a precondition. not for "joinRoom".
  schema,
  fn: (room, command, userId) => {
    if (room.pristine) {
      joinNewRoom(room, command, userId);
    } else {
      joinExistingRoom(room, command, userId);
    }
  }
};

export default joinRoomCommandHandler;

function joinNewRoom(room, command, userId) {
  const roomCreatedPayload = {};
  if (command.payload.password) {
    roomCreatedPayload.password = hashRoomPassword(command.payload.password);
  }
  room.applyEvent('roomCreated', roomCreatedPayload);

  const avatar = Number.isInteger(command.payload.avatar) ? command.payload.avatar : 0;

  // produce a "roomJoined" event for our new room
  // this event must contain all information about the room, such that every joining user gets the current room state!
  // since it is a new room, no stories , no selectedStory, only one (our) user
  const joinedRoomEventPayload = {
    users: [
      {
        disconnected: false,
        id: userId,
        avatar
      }
    ],
    stories: [],
    selectedStory: undefined,
    cardConfig: defaultCardConfig,
    autoReveal: true
  };
  room.applyEvent('joinedRoom', joinedRoomEventPayload);

  if (command.payload.username) {
    room.applyEvent('usernameSet', {
      username: command.payload.username
    });
  }

  if (command.payload.email) {
    room.applyEvent('emailSet', {
      email: command.payload.email,
      emailHash: calcEmailHash(command.payload.email)
    });
  }

  room.applyEvent('avatarSet', {
    avatar
  });
}

function joinExistingRoom(room, command, userId) {
  // if user joins an existing room with a preset userId, the userId is handled like a "session" token.
  // Since we do not handle any sensitive data, it is known and accepted, that with a known userId one user can hijack the "session" of
  // another user
  // so we do not check if another socket/userId pair is already connected/present in that room

  let userObject = getMatchingUserObjectFromRoom(room, command, userId);

  // produce a "roomJoined" event for an existing room
  // this event must contain all information about the room, such that every joining user gets the current room state!

  const joinedRoomEventPayload = {
    stories: [...room.stories],
    selectedStory: room.selectedStory,
    cardConfig: room.cardConfig ? room.cardConfig : defaultCardConfig,
    autoReveal: room.autoReveal
  };

  if (userObject) {
    joinedRoomEventPayload.users = modifyUser(room, userId, () => userObject).users;
  } else {
    userObject = {
      id: userId,
      username: command.payload.username,
      email: command.payload.email,
      avatar: command.payload.avatar || 0,
      disconnected: false,
      excluded: false
    };
    joinedRoomEventPayload.users = [...room.users, userObject];
  }

  room.applyEvent('joinedRoom', joinedRoomEventPayload);

  if (userObject.username) {
    room.applyEvent('usernameSet', {
      username: userObject.username
    });
  }

  if (userObject.email) {
    room.applyEvent('emailSet', {
      email: userObject.email,
      emailHash: calcEmailHash(userObject.email)
    });
  }

  room.applyEvent('avatarSet', {
    avatar: userObject.avatar
  });

  if (userObject.excluded) {
    room.applyEvent('excludedFromEstimations', {});
  }
}

/**
 *  maybe user already exists in room (clients can reconnect with their userId)
 */
function getMatchingUserObjectFromRoom(room, command, userId) {
  const matchingExistingUser = room.users.find((usr) => usr.id === userId);

  if (matchingExistingUser) {
    // use the already matching user (re-use already existing state like "excluded" flag etc.)
    // values from command payload take precedence.

    if (command.payload.username) {
      matchingExistingUser.username = command.payload.username;
    }

    if (command.payload.email) {
      matchingExistingUser.email = command.payload.email;
    }

    if (Number.isInteger(command.payload.avatar)) {
      matchingExistingUser.avatar = command.payload.avatar;
    }

    matchingExistingUser.disconnected = false;

    return matchingExistingUser;
  }

  return undefined;
}
