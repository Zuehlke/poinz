import {trackEvent} from '../analytics.js';

/**
 * A user joined a room: update "users" array in room object.
 * "users" array is already correctly built in handler of joinRoom command (../commandHandlers/joinRoom.js)
 */
function joinedRoomEventHandler(room, eventPayload, userId) {
  // Track room join event
  trackEvent('room_joined', {
    roomId: room.id,
    timestamp: Date.now(),
    totalUsers: room.users.length + 1,
    isNewRoom: room.users.length === 0
  }, userId);

  return {
    ...room,
    users: eventPayload.users
  };
}

export default joinedRoomEventHandler;
