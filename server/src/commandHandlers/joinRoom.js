import {v4 as uuid} from 'uuid';

import defaultCardConfig from '../defaultCardConfig';
import {calcEmailHash} from './setEmail';
import {modifyUser} from '../eventHandlers/roomModifiers';
import {hashRoomPassword, checkRoomPassword} from '../auth/roomPasswordService';
import {issueJwt, validateJwt} from '../auth/jwtService';

/**
 * A user joins a room.
 *
 * Two scenarios:  either the room exists already or the room with the given id does not exist yet.
 *
 * If the room does not yet exist, an additional "roomCreated" event is produced (as the first event).
 * Produces also a "roomJoined" event (which contains the room state).
 * Produces also events for additional properties if they are preset "usernameSet", "emailSet", "excludedFromEstimations".
 *
 * For password protected rooms, we will create a Json Web Token (JWT) with an expiration date of 1 hour and pass it to the one joining user via "tokenIssued" event.
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
              minLength: 0
            },
            token: {
              type: 'string'
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
  fn: (pushEvent, room, command, userId) => {
    if (room.pristine) {
      joinNewRoom(pushEvent, room, command, userId);
    } else {
      joinExistingRoom(pushEvent, room, command, userId);
    }
  }
};

export default joinRoomCommandHandler;

const sampleStory = {
  title: 'Welcome to your PoinZ room!',
  description:
    'This is a sample story that we already created for you.\n\n- On the left, you can edit your stories and add new ones.\n- Below you can estimate this story by clicking on one of the cards.\n- Invite your teammates by sharing the url with them.\n\n For more information, refer to the manual https://github.com/Zuehlke/poinz/blob/master/docu/manual.md'
};

function joinNewRoom(pushEvent, room, command, userId) {
  pushEvent('roomCreated', {
    password: command.payload.password ? hashRoomPassword(command.payload.password) : undefined
  });

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
    autoReveal: true,
    withConfidence: false,
    passwordProtected: !!command.payload.password
  };
  pushEvent('joinedRoom', joinedRoomEventPayload);

  if (command.payload.password) {
    pushEvent('tokenIssued', {token: issueJwt(userId, room.id)}, true);
  }

  if (command.payload.username) {
    pushEvent('usernameSet', {
      username: command.payload.username
    });
  }

  if (command.payload.email) {
    pushEvent('emailSet', {
      email: command.payload.email,
      emailHash: calcEmailHash(command.payload.email)
    });
  }
  pushEvent('avatarSet', {
    avatar
  });

  // it's a completely new room, add our sample/placeholder story with simple instructions / quick start
  const sampleStoryId = uuid();
  pushEvent('storyAdded', {
    createdAt: Date.now(),
    storyId: sampleStoryId,
    title: sampleStory.title,
    description: sampleStory.description,
    estimations: {}
  });
  pushEvent('storySelected', {storyId: sampleStoryId});
}

function joinExistingRoom(pushEvent, room, command, userId) {
  if (room.password) {
    throwIfJoinIsForbidden(room, command.payload);
  }

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
    autoReveal: room.autoReveal,
    withConfidence: room.withConfidence,
    passwordProtected: !!room.password
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

  pushEvent('joinedRoom', joinedRoomEventPayload);

  if (room.password && !command.payload.token) {
    pushEvent('tokenIssued', {token: issueJwt(userId, room.id)}, true);
  }

  if (userObject.username) {
    pushEvent('usernameSet', {
      username: userObject.username
    });
  }

  if (userObject.email) {
    pushEvent('emailSet', {
      email: userObject.email,
      emailHash: calcEmailHash(userObject.email)
    });
  }

  pushEvent('avatarSet', {
    avatar: userObject.avatar
  });

  if (userObject.excluded) {
    pushEvent('excludedFromEstimations', {userId: userObject.id});
  }
}

/**
 *
 * @param room
 * @param cmdPayload
 */
function throwIfJoinIsForbidden(room, cmdPayload) {
  if (cmdPayload.password) {
    const pwMatch = checkRoomPassword(cmdPayload.password, room.password.hash, room.password.salt);
    if (!pwMatch) {
      throw new Error('Not Authorized!');
    }
  } else if (cmdPayload.token) {
    const isValid = validateJwt(cmdPayload.token, room.id);
    if (!isValid) {
      throw new Error('Not Authorized!');
    }
  } else {
    throw new Error('Not Authorized!');
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
