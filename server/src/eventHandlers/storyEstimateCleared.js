const storyEstimateClearedEventHandler = (room, eventPayload) => (
  room.removeIn(['stories', eventPayload.storyId, 'estimations', eventPayload.userId])
);

export default storyEstimateClearedEventHandler;
