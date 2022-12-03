import {getActiveSeasonalEasterEgg} from '../../app/components/common/EasterEgg';

test('correct active Christmas', () => {
  // arbitrary december
  const resultA = getActiveSeasonalEasterEgg(new Date(2022, 11, 5));
  expect(resultA).toBeDefined();
  expect(resultA.id).toBe('xmas');

  // edge case "just active, first day"
  const resultD = getActiveSeasonalEasterEgg(new Date(2022, 11, 1)); // 1. December
  expect(resultD).toBeDefined();
  expect(resultD.id).toBe('xmas');

  // edge case "last day active"
  const resultE = getActiveSeasonalEasterEgg(new Date(2022, 11, 28)); // 28. December
  expect(resultE).toBeDefined();
  expect(resultE.id).toBe('xmas');

  // edge case  "just before it is active"
  const resultB = getActiveSeasonalEasterEgg(new Date(2022, 10, 30)); // 30. November
  expect(resultB).toBeUndefined();

  // edge case  "just after it has been active"
  const resultC = getActiveSeasonalEasterEgg(new Date(2022, 11, 29)); // 29. December
  expect(resultC).toBeUndefined();
});

test('correct active Halloween', () => {
  // arbitrary , e.g. two days before Halloween
  const resultA = getActiveSeasonalEasterEgg(new Date(2022, 9, 29));
  expect(resultA).toBeDefined();
  expect(resultA.id).toBe('halloween');

  // edge case "just active, first day"
  const resultD = getActiveSeasonalEasterEgg(new Date(2022, 9, 26)); // 26. October
  expect(resultD).toBeDefined();
  expect(resultD.id).toBe('halloween');

  // edge case "last day active"
  const resultE = getActiveSeasonalEasterEgg(new Date(2022, 9, 28)); // 3. November
  expect(resultE).toBeDefined();
  expect(resultE.id).toBe('halloween');

  // edge case  "just before it is active"
  const resultB = getActiveSeasonalEasterEgg(new Date(2022, 9, 25)); // 25. October
  expect(resultB).toBeUndefined();

  // edge case  "just after it has been active"
  const resultC = getActiveSeasonalEasterEgg(new Date(2022, 10, 4)); // 4. November
  expect(resultC).toBeUndefined();
});
