import assert from 'assert';
import Immutable from 'immutable';
import rootReducer from '../../app/services/rootReducer';
import {TOGGLE_USER_MENU, TOGGLE_LOG} from '../../app/actions/types';


describe('uiStateReducer', () => {

  describe('userMenu and log toggling', () => {

    it('show log', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom'
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(modifiedState.get('logShown'));
    });

    it('hide log', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom',
        logShown: true
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(!modifiedState.get('logShown'));
    });

    it('show user menu', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom'
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(modifiedState.get('userMenuShown'));
    });

    it('hide user menu', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom',
        userMenuShown: true
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(!modifiedState.get('userMenuShown'));
    });


    it('should hide user menu when showing log', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom',
        userMenuShown: true
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(!modifiedState.get('userMenuShown'));
      assert(modifiedState.get('logShown'));
    });


    it('should hide log when showing user menu', () => {
      const startingState = new Immutable.Map({
        roomId: 'myRoom',
        logShown: true
      });
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(!modifiedState.get('logShown'));
      assert(modifiedState.get('userMenuShown'));
    });

  });
});
