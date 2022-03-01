import {usersInitialState} from './users/usersReducer';
import {actionLogInitialState} from './actionLog/actionLogReducer';
import {storiesInitialState} from './stories/storiesReducer';
import {estimationsInitialState} from './estimations/estimationsReducer.js';
import {commandTrackingInitialState} from './commandTracking/commandTrackingReducer';
import {roomInitialState} from './room/roomReducer';
import {uiInitialState} from './ui/uiReducer';
import {joiningInitialState} from './joining/joiningReducer';

/**
 * The initial state that is loaded into the redux store on client application load.
 */
const INITIAL_STATE = () => ({
  stories: storiesInitialState,
  users: usersInitialState,
  estimations: estimationsInitialState,
  actionLog: actionLogInitialState,
  commandTracking: commandTrackingInitialState,
  room: roomInitialState,
  ui: uiInitialState,
  joining: joiningInitialState
});

export default INITIAL_STATE;
