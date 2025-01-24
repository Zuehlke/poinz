import initialState from '../../../src/state/initialState';
import {getSortedUserArray} from '../../../src/state/users/usersSelectors';

test('getSortedUserArray with initial state', () => {
  const state = {...initialState()};
  const users = getSortedUserArray(state);
  expect(users).toEqual([]);
});

test('getSortedUserArray with users', () => {
  const state = {...initialState()};

  state.users.ownUserId = '3';
  state.users.usersById = {
    1: {
      id: '1',
      username: 'Anna',
      excluded: true
    },
    2: {
      id: '2',
      username: 'Bert'
    },
    3: {
      id: '3',
      username: 'Ciara'
    },
    4: {
      id: '4',
      username: 'Donald'
    },
    5: {
      id: '5'
      /* no username set, yet */
    }
  };

  const users = getSortedUserArray(state);

  // first my own user, then "normal" users alphabetically. then users without a name, "exluded" users last
  expect(users.map((u) => u.id)).toEqual(['3', '2', '4', '5', '1']);
});
