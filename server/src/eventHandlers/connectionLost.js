/**
 * Marks user as "disconnected".
 */
const connectionLostEventHandler = (room, eventPayload, userId) => {
  const matchingUser = room.getIn(['users', userId]);
  if (matchingUser) {
    return room.updateIn(['users', userId], (user) => user.set('disconnected', true));
  } else {
    return room;
  }
};

export default connectionLostEventHandler;
