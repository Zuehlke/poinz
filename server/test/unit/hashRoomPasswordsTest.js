import hashRoomPassword from '../../src/commandHandlers/hashRoomPassword';

test('get hashed password with salt', () => {
  const hashed = hashRoomPassword('this-is-my-superPassword');

  expect(hashed.hash).toBeDefined();
  expect(hashed.salt).toBeDefined();
  expect(hashed.salt.length).toBe(12);
});
