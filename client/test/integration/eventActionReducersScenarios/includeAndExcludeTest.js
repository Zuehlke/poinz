import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';
import {getUsersById} from '../../../app/state/users/usersSelectors';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('includeAndExcludeTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Exclude and Include', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(10) // up until first "toggle" -> "excludedFromEstimations"
  );

  expect(getUsersById(modifiedState)[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: true, // <<-- flag set
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  expect(getUsersById(modifiedState)[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: false, // <<-- flag unset
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  // now second user toggles first user
  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  expect(getUsersById(modifiedState)[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: true, // <<-- flag set
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  expect(getUsersById(modifiedState)[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: false, // <<-- flag unset
    id: joinedEvtOne.userId,
    username: 'Jim'
  });
});
