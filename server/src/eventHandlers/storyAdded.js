import Immutable from 'immutable';

/**
 * a new story was added to the room
 */
const storyAddedEventHandler = (room, eventPayload) => {
  const newStory = Immutable.fromJS({
    ...eventPayload,
    estimations: {}
  });

  return room.update('stories', new Immutable.Map(), (stories) =>
    stories.set(eventPayload.id, newStory)
  );
};

export default storyAddedEventHandler;
