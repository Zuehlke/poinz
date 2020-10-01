/**
 * user set his email address
 */
const emailSetEventHandler = (room, eventPayload, userId) =>
  room.withMutations((transientRoom) =>
    transientRoom
      .setIn(['users', userId, 'email'], eventPayload.email)
      .setIn(['users', userId, 'emailHash'], eventPayload.emailHash)
  );

export default emailSetEventHandler;
