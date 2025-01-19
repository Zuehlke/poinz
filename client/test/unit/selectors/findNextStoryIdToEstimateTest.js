import {findNextStoryIdToEstimate} from '../../../src/state/estimations/estimationsSelectors';
import initialState from '../../../src/state/initialState';

test('next unrevealed', () => {
  const state = {...initialState()};

  state.stories.selectedStoryId = 1;
  state.stories.storiesById = {
    1: {
      id: 1,
      title: 'one',
      revealed: true,
      consensus: 5
    },
    2: {
      id: 2,
      title: 'two'
    },
    3: {
      id: 3,
      title: 'three'
    }
  };

  expect(findNextStoryIdToEstimate(state)).toBe(2);
});

test('next without consensus', () => {
  const state = {...initialState()};

  state.stories.selectedStoryId = 1;
  state.stories.storiesById = {
    1: {
      id: 1,
      title: 'one',
      revealed: true,
      consensus: 5
    },
    2: {
      id: 2,
      title: 'two',
      revealed: true,
      consensus: 2
    },
    3: {
      id: 3,
      title: 'three',
      revealed: true
    }
  };

  expect(findNextStoryIdToEstimate(state)).toBe(3);
});

test('all revealed and consensus ', () => {
  const state = {...initialState()};

  state.stories.selectedStoryId = 1;
  state.stories.storiesById = {
    1: {
      id: 1,
      title: 'one',
      revealed: true,
      consensus: 5
    },
    2: {
      id: 2,
      title: 'two',
      revealed: true,
      consensus: 8
    }
  };

  expect(findNextStoryIdToEstimate(state)).toBeUndefined();
});

test('all trashed', () => {
  const state = {...initialState()};

  state.stories.selectedStoryId = 1;
  state.stories.storiesById = {
    1: {
      id: 1,
      title: 'one',
      revealed: true,
      consensus: 5
    },
    2: {
      id: 2,
      title: 'one',
      trashed: true
    }
  };

  expect(findNextStoryIdToEstimate(state)).toBeUndefined();
});
