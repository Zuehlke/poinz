import jwt from 'jsonwebtoken';

import uuid from '../../../src/uuid';
import {issueJwt, validateJwt} from '../../../src/auth/jwtService';

test('issue a new jwt', () => {
  const userId = uuid();
  const roomId = uuid();

  const jwt = issueJwt(userId, roomId);

  expect(jwt).toBeDefined();
  expect(typeof jwt).toBe('string');
});

test('verify jwt', () => {
  const userId = uuid();
  const roomId = uuid();

  const token = issueJwt(userId, roomId);

  const payload = validateJwt(token, roomId);
  expect(payload).toBeDefined();
  expect(payload.sub).toBe(userId);
  expect(payload.aud).toBe(roomId);
});

test('verify jwt: fail salt', () => {
  const userId = uuid();
  const roomId = uuid();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      sub: userId,
      aud: roomId,
      iss: 'POINZ'
    },
    'arbitrarySalt'
  );

  const payload = validateJwt(token, roomId);
  expect(payload).toBeUndefined();
});
