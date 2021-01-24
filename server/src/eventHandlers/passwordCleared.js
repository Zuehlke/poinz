/**
 * user removed password protection from room
 */
const passwordClearedEventHandler = (room) => {
  const modifiedRoom = {
    ...room
  };

  delete modifiedRoom.password;

  return modifiedRoom;
};

export default passwordClearedEventHandler;
