/**
 * Sets "autoReveal" flag on room to true
 */
const autoRevealOffEventHandler = (room) => {
  return {
    ...room,
    autoReveal: true
  };
};

export default autoRevealOffEventHandler;
