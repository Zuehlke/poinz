import configureStore from '../../src/state/configureStore';

test('should return a correctly configured store with initial state', () => {
  const store = configureStore({users: {ownUserId: 'some'}, other: 'data'});
  expect(store).toBeDefined();
  expect(store.dispatch).toBeDefined();
  expect(store.getState().other).toEqual('data');
});
