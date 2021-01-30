/**
 * The server issued a new JWT token. this does not modify the room in any way.
 */
const tokenIssuedEventHandler = (room) => ({...room});

export default tokenIssuedEventHandler;
