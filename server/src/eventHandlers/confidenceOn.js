/**
 * Sets "withConfidence" flag on room to true. This enables "confidence levels" for estimations in this room.
 */
const confidenceOffEventHandler = (room) => {
  return {
    ...room,
    withConfidence: true
  };
};

export default confidenceOffEventHandler;
