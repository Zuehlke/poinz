/**
 * Sets "withConfidence" flag on room to false. This disables "confidence levels" for estimations in this room.
 */
const confidenceOffEventHandler = (room) => {
  return {
    ...room,
    withConfidence: false
  };
};

export default confidenceOffEventHandler;
