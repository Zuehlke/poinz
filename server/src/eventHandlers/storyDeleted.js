const storyDeletedEventHandler = (room, eventPayload) => (
  // for now, the changeStory command must contain always both attributes (see validation schema)
  // so we can just overwrite both
  // room.removeIn()
  //   .setIn(['stories', eventPayload.storyId, 'title'], eventPayload.title)
  //   .setIn(['stories', eventPayload.storyId, 'description'], eventPayload.description)
  room.removeIn(['stories', eventPayload.storyId])
  // room.setIn(['stories', eventPayload.storyId, 'deleted'], true)
);

export default storyDeletedEventHandler;
