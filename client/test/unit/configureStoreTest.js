import assert from 'assert';
import Immutable from 'immutable';
import configureStore from '../../app/store/configureStore';

describe('configureStore', () => {

  it('should return a correctly configured store', () => {
    const store = configureStore();
    assert(store);
    assert(store.dispatch);
    assert.deepEqual(store.getState(), {});
  });

  it('should return a correctly configured store with initial state', () => {
    const store = configureStore(new Immutable.Map({some: 'data'}));
    assert(store);
    assert(store.dispatch);
    assert.deepEqual(store.getState().toJS(), {some: 'data'});
  });

});
