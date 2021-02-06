import initialState from '../../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('includeAndExcludeTest.json');
});

test('Exclude and Include', () => {
  let modifiedState;

  const joinedEvtOne = events[1];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 10) // up until first "toggle" -> "excludedFromEstimations"
  );

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: true, // <<-- flag set
    id: joinedEvtOne.userId,
    username: 'Jim'
  });

  modifiedState = reduceMultipleEvents(modifiedState, [events[10]]);

  expect(modifiedState.users[joinedEvtOne.userId]).toEqual({
    avatar: 0,
    disconnected: false,
    excluded: false, // <<-- flag unset
    id: joinedEvtOne.userId,
    username: 'Jim'
  });
});
