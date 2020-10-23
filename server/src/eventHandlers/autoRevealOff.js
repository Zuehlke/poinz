/**
 * Sets "autoReveal" flag on room to false
 */
const autoRevealOffEventHandler = (room) => {
  return {
    ...room,
    autoReveal: false
  };
};

export default autoRevealOffEventHandler;
