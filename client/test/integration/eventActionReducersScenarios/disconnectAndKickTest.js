import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';
import {getUsersById} from '../../../app/state/users/usersSelectors';
import {getEstimations} from '../../../app/state/estimations/estimationsSelectors';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('disconnectAndKickTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Two users in a room, the other one disconnects, then you kick him', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];
  const joinedEvtTwo = scenario.events[6];
  const addedEvt = scenario.events[3];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(11) // up until "connectionLost"
  );

  // in contrast to "roomLeft",  on "connectionLost", user object stays. is marked as disconnected
  expect(getUsersById(modifiedState)[joinedEvtTwo.userId]).toEqual({
    avatar: 0,
    excluded: false,
    username: 'John',
    disconnected: true, // <<-
    id: joinedEvtTwo.userId
  });

  // also the estimation of the disconnected user is still in state
  expect(getEstimations(modifiedState)[addedEvt.payload.storyId]).toEqual({
    [joinedEvtTwo.userId]: {value: 8, confidence: 0}
  });

  const kickedEvent = scenario.getSingleNextEvent();
  modifiedState = reduceMultipleEvents(modifiedState, kickedEvent);

  // now only our own user is left
  expect(getUsersById(modifiedState)).toEqual({
    [joinedEvtOne.userId]: {
      avatar: 0,
      disconnected: false,
      username: 'Jim',
      id: joinedEvtOne.userId
    }
  });

  // estimation values are kept, even for kicked users
  expect(getEstimations(modifiedState)[addedEvt.payload.storyId]).toEqual({
    [joinedEvtTwo.userId]: {value: 8, confidence: 0}
  });
});
