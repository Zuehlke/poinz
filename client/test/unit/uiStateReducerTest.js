import rootReducer from '../../app/services/rootReducer';
import {TOGGLE_USER_MENU, TOGGLE_LOG} from '../../app/actions/types';

describe('userMenu and log toggling', () => {
  test('show log', () => {
    const startingState = {
      roomId: 'myRoom'
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_LOG
    });
    expect(modifiedState.logShown).toBe(true);
  });

  test('hide log', () => {
    const startingState = {
      roomId: 'myRoom',
      logShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_LOG
    });
    expect(modifiedState.logShown).toBe(false);
  });

  test('show user menu', () => {
    const startingState = {
      roomId: 'myRoom'
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_USER_MENU
    });
    expect(modifiedState.userMenuShown).toBe(true);
  });

  test('hide user menu', () => {
    const startingState = {
      roomId: 'myRoom',
      userMenuShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_USER_MENU
    });
    expect(modifiedState.userMenuShown).toBe(false);
  });

  test('should hide user menu when showing log', () => {
    const startingState = {
      roomId: 'myRoom',
      userMenuShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_LOG
    });
    expect(modifiedState.userMenuShown).toBe(false);
    expect(modifiedState.logShown).toBe(true);
  });

  test('should hide log when showing user menu', () => {
    const startingState = {
      roomId: 'myRoom',
      logShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_USER_MENU
    });
    expect(modifiedState.logShown).toBe(false);
    expect(modifiedState.userMenuShown).toBe(true);
  });
});
