import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';
import {getStoryById} from '../../../src/state/stories/storiesSelectors';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('estimatingSettlingSettingTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Estimation with two users, also settling story and manually setting value', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  const addedEvtOne = scenario.events[9];
  const storyIdOne = addedEvtOne.payload.storyId;

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(15) // all events up until both users estimated (different values), story is now revealed
  );

  // story is revealed, but no consensus
  expect(modifiedState.stories.selectedStoryId).toBe(storyIdOne);
  expect(getStoryById(modifiedState, storyIdOne).revealed).toBe(true);
  expect(getStoryById(modifiedState, storyIdOne).consensus).toBeUndefined();

  // now user manually settles
  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); //  settle -> consensusAchieved
  expect(getStoryById(modifiedState, storyIdOne).revealed).toBe(true);
  expect(getStoryById(modifiedState, storyIdOne).consensus).toBe(5);

  // now user 2 manually sets value (via matrix)
  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); //  setStoryValue -> storyValueSet
  expect(getStoryById(modifiedState, storyIdOne).revealed).toBe(true);
  expect(getStoryById(modifiedState, storyIdOne).consensus).toBe(13);
});
