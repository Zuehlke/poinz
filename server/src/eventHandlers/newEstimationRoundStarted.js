import Immutable from 'immutable';

/**
 * Clears all estimations on story, sets "revealed" flag to false and erases "consensus"
 */
const newEstimationRoundStartedEventHandler = (room, eventPayload) =>
  room
    .setIn(['stories', eventPayload.storyId, 'estimations'], new Immutable.Map())
    .setIn(['stories', eventPayload.storyId, 'revealed'], false)
    .setIn(['stories', eventPayload.storyId, 'consensus'], undefined);

export default newEstimationRoundStartedEventHandler;
