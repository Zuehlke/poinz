/**
 * Estimations for the given story were revealed.
 * This happens if all users that can estimate (not marked as visitor, not disconnected) did estimate the current story (i.e. if the last user gives his estimate)
 * This happens if a user manually reveals. (this is helpful, if someone is AFK and team wants to proceed with the estimation meeting=
 */
const revealedEventHandler = (room, eventPayload) => (
  room.setIn(['stories', eventPayload.storyId, 'revealed'], true)
);

export default revealedEventHandler;
