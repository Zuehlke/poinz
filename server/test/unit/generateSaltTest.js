import generateSalt from '../../src/auth/generateSalt';

test('generateSalt default length', () => {
  const salt = generateSalt();
  expect(salt).toHaveLength(12);
});

test('generateSalt specific length', () => {
  const salt = generateSalt(20);
  expect(salt).toHaveLength(20);
});
