import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import getScenarioStartingState from './getScenarioStartingState';
import {
  getStoriesById,
  hasSelectedStoryConsensus,
  hasStoryConsensus
} from '../../../app/state/stories/storiesSelectors';
import {getEstimations} from '../../../app/state/estimations/estimationsSelectors';
import {hasApplause} from '../../../app/state/ui/uiSelectors';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('estimatingTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Estimation with two users', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];
  const joinedEvtTwo = scenario.events[5];

  const addedEvtOne = scenario.events[10];
  const storyIdOne = addedEvtOne.payload.storyId;
  const addedEvtTwo = scenario.events[11];
  const storyIdTwo = addedEvtTwo.payload.storyId;

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(14) // up until first story estimate given
  );

  expect(getStoriesById(modifiedState)[storyIdOne]).toEqual({
    createdAt: addedEvtOne.payload.createdAt,
    description: 'This is a story',
    id: storyIdOne,
    title: 'ISSUE-SUPER-2'
  });
  expect(getStoriesById(modifiedState)[storyIdTwo]).toEqual({
    createdAt: addedEvtTwo.payload.createdAt,
    description: 'This is a second story',
    id: storyIdTwo,
    title: 'ISSUE-SUPER-5'
  });

  expect(getEstimations(modifiedState)).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: {value: 3, confidence: 0}
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); //  storyEstimateCleared
  expect(getEstimations(modifiedState)).toEqual({
    [storyIdOne]: {
      // no estimations for this story anymore
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(2)); // both did estimate
  expect(getEstimations(modifiedState)).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: {value: 5, confidence: 0},
      [joinedEvtTwo.userId]: {value: 5, confidence: 1}
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(2)); // revealed and consensus
  expect(getStoriesById(modifiedState)[storyIdOne].revealed).toBe(true);
  expect(getStoriesById(modifiedState)[storyIdOne].consensus).toBe(5);
  expect(hasStoryConsensus(getStoriesById(modifiedState)[storyIdOne])).toBe(true);
  expect(hasSelectedStoryConsensus(modifiedState)).toBe(true);
  expect(hasStoryConsensus(getStoriesById(modifiedState)[storyIdTwo])).toBe(false);
  expect(hasApplause(modifiedState)).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // new round
  expect(getStoriesById(modifiedState)[storyIdOne].revealed).toBe(false); // story no longer revealed
  expect(getStoriesById(modifiedState)[storyIdOne].consensus).toBe(undefined);
  expect(hasSelectedStoryConsensus(modifiedState)).toBe(false);
  expect(hasStoryConsensus(getStoriesById(modifiedState)[storyIdOne])).toBe(false);

  expect(getEstimations(modifiedState)).toEqual({
    // old values for story removed
  });
  expect(hasApplause(modifiedState)).toBe(false);
});
