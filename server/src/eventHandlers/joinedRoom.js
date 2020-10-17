/**
 * A user joined a room: update "users" array in room object.
 * "users" array is already correctly built in handler of joinRoom command (../commandHandlers/joinRoom.js)
 */
const joinedRoomEventHandler = (room, eventPayload) => {
  return {
    ...room,
    users: eventPayload.users
  };
};

export default joinedRoomEventHandler;
