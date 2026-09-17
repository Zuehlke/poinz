import {shouldPlayRevealSound} from '../../src/state/actions/eventActions';

const event = (manually) => ({name: 'revealed', roomId: 'room-1', payload: {manually}});
const state = (soundEffectsEnabled) => ({
  room: {roomId: 'room-1'},
  ui: {soundEffectsEnabled}
});

test('plays for automatic reveals when sound effects are enabled', () => {
  expect(shouldPlayRevealSound(event(false), state(true))).toBe(true);
});

test('does not play for manual reveals', () => {
  expect(shouldPlayRevealSound(event(true), state(true))).toBe(false);
});

test('does not play when sound effects are disabled', () => {
  expect(shouldPlayRevealSound(event(false), state(false))).toBe(false);
});

test('does not play for unrelated events', () => {
  expect(
    shouldPlayRevealSound(
      {name: 'storyEstimateGiven', roomId: 'room-1', payload: {}},
      state(true)
    )
  ).toBe(false);
});

test('does not play for stale events from another room', () => {
  expect(
    shouldPlayRevealSound({...event(false), roomId: 'room-2'}, state(true))
  ).toBe(false);
});
