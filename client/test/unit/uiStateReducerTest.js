import rootReducer from '../../app/services/rootReducer';
import {TOGGLE_SETTINGS, TOGGLE_LOG} from '../../app/actions/types';

describe('Settings and Action Log toggling', () => {
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

  test('show settings', () => {
    const startingState = {
      roomId: 'myRoom'
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_SETTINGS
    });
    expect(modifiedState.settingsShown).toBe(true);
  });

  test('hide settings', () => {
    const startingState = {
      roomId: 'myRoom',
      settingsShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_SETTINGS
    });
    expect(modifiedState.settingsShown).toBe(false);
  });

  test('should hide settings when showing log', () => {
    const startingState = {
      roomId: 'myRoom',
      settingsShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_LOG
    });
    expect(modifiedState.settingsShown).toBe(false);
    expect(modifiedState.logShown).toBe(true);
  });

  test('should hide log when showing settings', () => {
    const startingState = {
      roomId: 'myRoom',
      logShown: true
    };
    const modifiedState = rootReducer(startingState, {
      type: TOGGLE_SETTINGS
    });
    expect(modifiedState.logShown).toBe(false);
    expect(modifiedState.settingsShown).toBe(true);
  });
});
