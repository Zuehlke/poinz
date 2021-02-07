import initialState from '../../../app/state/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

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
  const addedEvtOne = scenario.events[9];
  const addedEvtTwo = scenario.events[10];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(11) // we don't need all events, only the first 12 events until both stories are added
  );

  // stories are correctly stored as object. storyIds are the keys.
  // no "estimations" on stories. estimations are stored seperately on state
  expect(modifiedState.stories[addedEvtOne.payload.storyId]).toEqual({
    id: addedEvtOne.payload.storyId,
    title: addedEvtOne.payload.title,
    description: addedEvtOne.payload.description,
    createdAt: addedEvtOne.payload.createdAt
  });
  expect(modifiedState.stories[addedEvtTwo.payload.storyId]).toEqual({
    id: addedEvtTwo.payload.storyId,
    title: addedEvtTwo.payload.title,
    description: addedEvtTwo.payload.description,
    createdAt: addedEvtTwo.payload.createdAt
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
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(13) // we don't need all events,  only the first 13 events until both stories are edited (changed)
  );

  expect(modifiedState.stories[addedEvtOne.payload.storyId]).toEqual({
    id: addedEvtOne.payload.storyId,
    title: changedEvtOne.payload.title,
    description: changedEvtOne.payload.description,
    createdAt: addedEvtOne.payload.createdAt,
    editMode: false
  });

  expect(modifiedState.stories[addedEvtTwo.payload.storyId]).toEqual({
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
    {
      ...initialState(),
      roomId: scenario.events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    scenario.getNextEvents(14) // up until trashed
  );
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(true);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getSingleNextEvent()); // restored event
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, scenario.getNextEvents(2)); // trashed & deleted event
  expect(modifiedState.stories[addedEvtOne.payload.storyId]).toBeUndefined(); // story is removed completely

  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
});
