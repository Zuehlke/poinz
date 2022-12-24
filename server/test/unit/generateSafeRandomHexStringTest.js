import generateSafeRandomHexString from '../../src/auth/generateSafeRandomHexString.js';

test('with default length', () => {
  const randomHexString = generateSafeRandomHexString();
  expect(randomHexString).toHaveLength(12);
});

test('with specific length', () => {
  const randomHexString = generateSafeRandomHexString(20);
  expect(randomHexString).toHaveLength(20);
});
