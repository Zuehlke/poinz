import jwt from 'jsonwebtoken';

import uuid from '../../../src/uuid.js';
import {issueJwt, verifyJwt} from '../../../src/auth/jwtService.js';

test('issue a new jwt', () => {
  const userId = uuid();
  const roomId = uuid();

  const token = issueJwt(userId, roomId);

  expect(token).toBeDefined();
  expect(typeof token).toBe('string');
});

test('verify jwt', () => {
  const userId = uuid();
  const roomId = uuid();

  const token = issueJwt(userId, roomId);

  const tokenPayload = verifyJwt(token, roomId);
  expect(tokenPayload).toBeDefined();
  expect(tokenPayload.sub).toBe(userId);
  expect(tokenPayload.aud).toBe(roomId);
});

test('verify jwt: fail secret', () => {
  const userId = uuid();
  const roomId = uuid();

  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      sub: userId,
      aud: roomId,
      iss: 'POINZ'
    },
    'arbitrary-Secret'
  );

  const tokenPayload = verifyJwt(token, roomId);
  expect(tokenPayload).toBeUndefined();
});
