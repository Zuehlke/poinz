import initialState from '../../../../app/store/initialState';
import reduceMultipleEvents from './reduceMultipleEvents';
import loadEventsFromJson from './loadEventsFromJson';

let events;

beforeAll(async () => {
  events = await loadEventsFromJson('estimatingTest.json');
});

test('Estimation with two users', () => {
  let modifiedState;

  const joinedEvtOne = events[1];
  const joinedEvtTwo = events[5];

  const addedEvtOne = events[9];
  const storyIdOne = addedEvtOne.payload.storyId;
  const addedEvtTwo = events[10];
  const storyIdTwo = addedEvtTwo.payload.storyId;

  modifiedState = reduceMultipleEvents(
    {
      ...initialState(),
      roomId: events[0].roomId,
      pendingJoinCommandId: joinedEvtOne.correlationId
    },
    events.slice(0, 13) // up until first story estimate given
  );

  expect(modifiedState.stories[storyIdOne]).toEqual({
    createdAt: addedEvtOne.payload.createdAt,
    description: 'This is a story',
    id: storyIdOne,
    title: 'ISSUE-SUPER-2'
  });
  expect(modifiedState.stories[storyIdTwo]).toEqual({
    createdAt: addedEvtTwo.payload.createdAt,
    description: 'This is a second story',
    id: storyIdTwo,
    title: 'ISSUE-SUPER-5'
  });

  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: 3
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, [events[13]]); //  storyEstimateCleared
  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      // no estimations for this story anymore
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(14, 16)); // both did estimate
  expect(modifiedState.estimations).toEqual({
    [storyIdOne]: {
      [joinedEvtOne.userId]: 5,
      [joinedEvtTwo.userId]: 5
    }
  });

  modifiedState = reduceMultipleEvents(modifiedState, events.slice(16, 18)); // revealed and consensus
  expect(modifiedState.stories[storyIdOne].revealed).toBe(true);
  expect(modifiedState.stories[storyIdOne].consensus).toBe(5);
  expect(modifiedState.applause).toBe(true);

  modifiedState = reduceMultipleEvents(modifiedState, [events[18]]); // new round
  expect(modifiedState.stories[storyIdOne].revealed).toBe(false); // story no longer revealed
  expect(modifiedState.stories[storyIdOne].consensus).toBe(undefined);
  expect(modifiedState.estimations).toEqual({
    // old values for story removed
  });
  expect(modifiedState.applause).toBe(false);
});
