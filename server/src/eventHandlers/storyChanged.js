const storyChangedEventHandler = (room, eventPayload) => (
  // for now, the changeStory command must contain always both attributes (see validation schema)
  // so we can just overwrite both
  room
    .setIn(['stories', eventPayload.storyId, 'title'], eventPayload.title)
    .setIn(['stories', eventPayload.storyId, 'description'], eventPayload.description)
);

export default storyChangedEventHandler;
