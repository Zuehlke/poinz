import Immutable from 'immutable';

const storyAddedEventHandler = (room, eventPayload) => {

  const newStory = Immutable.fromJS(Object.assign(eventPayload, {
    estimations: {}
  }));

  return room.update('stories', new Immutable.Map(), stories => stories.set(eventPayload.id, newStory));
};

export default storyAddedEventHandler;
