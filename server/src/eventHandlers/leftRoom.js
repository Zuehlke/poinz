/**
 * removes user from "users" list
 * removes estimations on all stories that were given by user
 */
const leftRoomEventHandler = (room, eventPayload, userId) =>
  room

    // remove leaving user's estimations from all stories
    .update('stories', (stories) => stories.map((story) => story.removeIn(['estimations', userId])))
    // then remove user from room
    .removeIn(['users', userId]);

export default leftRoomEventHandler;
