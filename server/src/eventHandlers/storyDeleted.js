const storyDeletedEventHandler = (room, eventPayload) => (
  room.removeIn(['stories', eventPayload.storyId])
);

export default storyDeletedEventHandler;
