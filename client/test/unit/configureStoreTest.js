import configureStore from '../../app/state/configureStore';

test('should return a correctly configured store', () => {
  const store = configureStore();
  expect(store).toBeDefined();
  expect(store.dispatch).toBeDefined();
});

test('should return a correctly configured store with initial state', () => {
  const store = configureStore({some: 'data'});
  expect(store).toBeDefined();
  expect(store.dispatch).toBeDefined();
  expect(store.getState().some).toEqual('data');
});
