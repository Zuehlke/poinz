import {hashRoomPassword, checkRoomPassword} from '../../../src/auth/roomPasswordService.js';

test('get hashed password with salt', () => {
  const hashed = hashRoomPassword('this-is-my-superPassword');

  expect(hashed.hash).toBeDefined();
  expect(hashed.salt).toBeDefined();
  expect(hashed.salt.length).toBe(12);
});

test('check password match', () => {
  const hashed = hashRoomPassword('this-is-my-superPassword');

  const result = checkRoomPassword('this-is-my-superPassword', hashed.hash, hashed.salt);

  expect(result).toBe(true);
});

test('check password mismatch', () => {
  const hashed = hashRoomPassword('this-is-my-superPassword');

  const result = checkRoomPassword('this-does-not-compute', hashed.hash, hashed.salt);

  expect(result).toBe(false);
});
