import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

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
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(10) // up until first "toggle" -> "excludedFromEstimations"
  );

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: true, // <<-- flag set
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: false, // <<-- flag unset
    id: joinedEvtOne.userId,
    username: 'Jim'
  });
});
