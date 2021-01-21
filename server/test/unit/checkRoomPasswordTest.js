import hashRoomPassword from '../../src/commandHandlers/hashRoomPassword';
import checkRoomPassword from '../../src/commandHandlers/checkRoomPassword';

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
