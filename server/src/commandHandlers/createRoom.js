import {v4 as uuid} from 'uuid';

/**
 * A user creates a new room
 *
 *
 *
 */
const createRoomCommandHandler = {
  canCreateRoom: true,
  fn: (room, command) => {
    const newUser = {
      id: command.payload.userId || uuid(), // client can cache/store userId and send it already with "joinRoom" command
      username: command.payload.username // client can cache/store username and send it already with "joinRoom" command
    };

    room.applyEvent('roomCreated', {
      id: command.roomId,
      userId: newUser.id,
      roomAlias: command.payload.roomAlias
    });

    // produce a "roomJoined" event for a new room
    // the current user (the creator) will be the only one in this room
    const joinedRoomEventPayload = {
      userId: newUser.id,
      users: {
        [newUser.id]: newUser
      }
    };

    room.applyEvent('joinedRoom', joinedRoomEventPayload);

    if (command.payload.username) {
      room.applyEvent('usernameSet', {
        userId: newUser.id,
        username: command.payload.username
      });
    }

    if (command.payload.email) {
      room.applyEvent('emailSet', {
        userId: newUser.id,
        email: command.payload.email
      });
    }
  }
};

export default createRoomCommandHandler;
