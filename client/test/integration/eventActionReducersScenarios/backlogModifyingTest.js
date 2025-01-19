import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';
import {
  getSelectedStory,
  getSelectedStoryId,
  getStoriesById,
  getTrashedStories,
  isAStorySelected
} from '../../../src/state/stories/storiesSelectors';
import getScenarioStartingState from './getScenarioStartingState';

let scenario;

beforeAll(async () => {
  scenario = await loadEventsFromJson('backlogModifyingTest.json');
});

beforeEach(() => {
  scenario.reset();
});

test('Adding Stories', async () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];
  const addedEvtDefault = scenario.events[4]; // on room creation, a default "sample" story is already added
  const addedEvtOne = scenario.events[9];
  const addedEvtTwo = scenario.events[10];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(11) // we don't need all events, only the first 12 events until both stories are added
  );

  // stories are correctly stored as object. storyIds are the keys.
  // no "estimations" on stories. estimations are stored separately on state

  expect(getStoriesById(modifiedState)[addedEvtOne.payload.storyId]).toEqual({
    id: addedEvtOne.payload.storyId,
    title: addedEvtOne.payload.title,
    description: addedEvtOne.payload.description,
    createdAt: addedEvtOne.payload.createdAt
  });
  expect(getStoriesById(modifiedState)[addedEvtTwo.payload.storyId]).toEqual({
    id: addedEvtTwo.payload.storyId,
    title: addedEvtTwo.payload.title,
    description: addedEvtTwo.payload.description,
    createdAt: addedEvtTwo.payload.createdAt
  });

  expect(isAStorySelected(modifiedState)).toBe(true);
  expect(getSelectedStoryId(modifiedState)).toBe(addedEvtDefault.payload.storyId);
  expect(getSelectedStory(modifiedState)).toMatchObject({
    id: addedEvtDefault.payload.storyId,
    title: addedEvtDefault.payload.title
  });
});

test('Editing Stories', async () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  const addedEvtOne = scenario.events[9];
  const addedEvtTwo = scenario.events[10];

  const changedEvtOne = scenario.events[11];
  const changedEvtTwo = scenario.events[12];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(13) // we don't need all events,  only the first 13 events until both stories are edited (changed)
  );

  expect(getStoriesById(modifiedState)[addedEvtOne.payload.storyId]).toEqual({
    id: addedEvtOne.payload.storyId,
    title: changedEvtOne.payload.title,
    description: changedEvtOne.payload.description,
    createdAt: addedEvtOne.payload.createdAt,
    editMode: false
  });

  expect(getStoriesById(modifiedState)[addedEvtTwo.payload.storyId]).toEqual({
    id: addedEvtTwo.payload.storyId,
    title: changedEvtTwo.payload.title,
    description: changedEvtTwo.payload.description,
    createdAt: addedEvtTwo.payload.createdAt,
    editMode: false
  });
});

test('Trashing, Restoring and Deleting stories', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];
  const addedEvtOne = scenario.events[9];
  const addedEvtTwo = scenario.events[10];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(14) // up until trashed
  );
  expect(getTrashedStories(modifiedState).length).toBe(1);
  expect(getTrashedStories(modifiedState)[0].id).toBe(addedEvtTwo.payload.storyId);
  expect(getStoriesById(modifiedState)[addedEvtTwo.payload.storyId].trashed).toBe(true);
  expect(getStoriesById(modifiedState)[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // restored event
  expect(getStoriesById(modifiedState)[addedEvtTwo.payload.storyId].trashed).toBe(false);
  expect(getStoriesById(modifiedState)[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(2)); // trashed & deleted event
  expect(getStoriesById(modifiedState)[addedEvtOne.payload.storyId]).toBeUndefined(); // story is removed completely

  expect(getStoriesById(modifiedState)[addedEvtTwo.payload.storyId].trashed).toBe(false);
});

test('manual ordering', () => {
  let modifiedState;

  const joinedEvtOne = scenario.events[1];

  modifiedState = reduceMultipleEvents(
    getScenarioStartingState(joinedEvtOne.correlationId),
    scenario.getNextEvents(20) // up until and including first "sortOrderSet"
  );

  const sortOrderSetOne = scenario.events[19];
  const sortOrderSetTwo = scenario.events[20];

  const getCurrentStoriesAndOrder = (state) =>
    Object.values(getStoriesById(state))
      .sort((sA, sB) => sA.sortOrder - sB.sortOrder)
      .map((s) => s.id);

  expect(getCurrentStoriesAndOrder(modifiedState)).toEqual(sortOrderSetOne.payload.sortOrder);

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent());

  expect(getCurrentStoriesAndOrder(modifiedState)).toEqual(sortOrderSetTwo.payload.sortOrder);
});
