import eventReducer from '../../../app/services/eventReducer';

export default function reduceMultipleEventActions(startingState, actions) {
  let modfifiedState = startingState;
  actions.forEach((e) => (modfifiedState = eventReducer(modfifiedState, e)));
  return modfifiedState;
}
