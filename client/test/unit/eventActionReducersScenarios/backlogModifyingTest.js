import initialState from '../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('backlogModifyingTest.json');
});

test('Adding Stories', async () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const addedEvtOne = events[7];
  const addedEvtTwo = events[9];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 10) // we use not all events, only the first 10 events until both stories are added
  );
  expect(modifiedState.selectedStory).toEqual(addedEvtOne.payload.storyId);
  expect(modifiedState.stories).toEqual({
    // .stories is correctly stored as object. storyIds are the keys.
    // no "estimations" on stories. are stored seperately on state
    [addedEvtOne.payload.storyId]: {
      id: addedEvtOne.payload.storyId,
      title: addedEvtOne.payload.title,
      description: addedEvtOne.payload.description,
      createdAt: addedEvtOne.payload.createdAt
    },
    [addedEvtTwo.payload.storyId]: {
      id: addedEvtTwo.payload.storyId,
      title: addedEvtTwo.payload.title,
      description: addedEvtTwo.payload.description,
      createdAt: addedEvtTwo.payload.createdAt
    }
  });
});

test('Editing Stories', async () => {
  let modifiedState;

  const joinedEvtOne = events[1];

  const addedEvtOne = events[7];
  const addedEvtTwo = events[9];

  const changedEvtOne = events[11];
  const changedEvtTwo = events[12];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 13) // we use not all events, only the first 13 events until both stories are edited (changed)
  );
  expect(modifiedState.selectedStory).toEqual(addedEvtTwo.payload.storyId);
  expect(modifiedState.stories).toEqual({
    [addedEvtOne.payload.storyId]: {
      id: addedEvtOne.payload.storyId,
      title: changedEvtOne.payload.title,
      description: changedEvtOne.payload.description,
      createdAt: addedEvtOne.payload.createdAt,
      editMode: false
    },
    [addedEvtTwo.payload.storyId]: {
      id: addedEvtTwo.payload.storyId,
      title: changedEvtTwo.payload.title,
      description: changedEvtTwo.payload.description,
      createdAt: addedEvtTwo.payload.createdAt,
      editMode: false
    }
  });
});

test('Trashing, Restoring and Deleting stories', () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const addedEvtOne = events[7];
  const addedEvtTwo = events[9];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 15) // up until trashed+selected
  );
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(true);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged
  expect(modifiedState.selectedStory).toEqual(addedEvtOne.payload.storyId);

  modifiedState = reduceMultipleEvents(
    modifiedState,
    events.slice(15, 16) // restored event
  );
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(16, 19));
  expect(modifiedState.stories[addedEvtOne.payload.storyId]).toBeUndefined(); // story is removed completely

  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
  expect(modifiedState.selectedStory).toEqual(addedEvtTwo.payload.storyId);
});
