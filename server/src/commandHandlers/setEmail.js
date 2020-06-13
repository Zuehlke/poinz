/**
 * A user sets his email address (used for Gravatar image fetching. See https://en.gravatar.com/ ).
 */
module.exports = {
  fn: (room, command) => {
    room.applyEvent('emailSet', command.payload);
  }
};
