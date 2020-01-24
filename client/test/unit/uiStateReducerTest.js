import assert from 'assert';
import rootReducer from '../../app/services/rootReducer';
import {TOGGLE_USER_MENU, TOGGLE_LOG} from '../../app/actions/types';


describe('uiStateReducer', () => {

  describe('userMenu and log toggling', () => {

    it('show log', () => {
      const startingState = {
        roomId: 'myRoom'
      };
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(modifiedState.logShown);
    });

    it('hide log', () => {
      const startingState = {
        roomId: 'myRoom',
        logShown: true
      };
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(!modifiedState.logShown);
    });

    it('show user menu', () => {
      const startingState = {
        roomId: 'myRoom'
      } ;
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(modifiedState.userMenuShown);
    });

    it('hide user menu', () => {
      const startingState = {
        roomId: 'myRoom',
        userMenuShown: true
      } ;
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(!modifiedState.userMenuShown);
    });


    it('should hide user menu when showing log', () => {
      const startingState =  {
        roomId: 'myRoom',
        userMenuShown: true
      } ;
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_LOG
      });
      assert(!modifiedState.userMenuShown);
      assert(modifiedState.logShown);
    });


    it('should hide log when showing user menu', () => {
      const startingState =  {
        roomId: 'myRoom',
        logShown: true
      } ;
      const modifiedState = rootReducer(startingState, {
        type: TOGGLE_USER_MENU
      });
      assert(!modifiedState.logShown);
      assert(modifiedState.userMenuShown);
    });

  });
});
