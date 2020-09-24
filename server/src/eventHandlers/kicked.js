/**
 * removes user from "users" list
 * removes estimations on all stories that were given by user
 */
const kickedEventHandler = (room, eventPayload) =>
  // Do not remove estimations. "moderator" might want to export stories and estimations after participants left the room.
  // this means, we keep part of the "history".. on export we will not be able to export the username, we are left with the userId...

  // remove user from room
  room.removeIn(['users', eventPayload.userId]);

export default kickedEventHandler;
