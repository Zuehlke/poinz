import initialState from '../../../../app/store/initialState.js';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('backlogModifyingTest.json');
});

test('Adding Stories', async () => {
  let modifiedState;

  // [0=>roomCreated, 1=>joinedRoom, 2=>avatarSet, 3=>storyAdded, 4=>storySelected, 5=>joinedRoom, 6=>avatarSet, 7=>usernameSet, 8=>usernameSet, 9=>storyAdded, 10=>storyAdded, 11=>storyChanged, 12=>storyChanged, 13=>storyTrashed, 14=>storyRestored, 15=>storyTrashed, 16=>storyDeleted]

  const joinedEvtOne = events[1];
  const addedEvtOne = events[9];
  const addedEvtTwo = events[10];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 11) // we don't need all events, only the first 12 events until both stories are added
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

  const joinedEvtOne = events[1];

  const addedEvtOne = events[9];
  const addedEvtTwo = events[10];

  const changedEvtOne = events[11];
  const changedEvtTwo = events[12];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 13) // we don't need all events,  only the first 13 events until both stories are edited (changed)
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

  const joinedEvtOne = events[1];
  const addedEvtOne = events[9];
  const addedEvtTwo = events[10];

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 14) // up until trashed
  );
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(true);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(
    modifiedState,
    [events[14]] // restored event
  );
  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
  expect(modifiedState.stories[addedEvtOne.payload.storyId].trashed).toBeUndefined(); // unchanged

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(15, 17)); // trashed & deleted event
  expect(modifiedState.stories[addedEvtOne.payload.storyId]).toBeUndefined(); // story is removed completely

  expect(modifiedState.stories[addedEvtTwo.payload.storyId].trashed).toBe(false);
});
