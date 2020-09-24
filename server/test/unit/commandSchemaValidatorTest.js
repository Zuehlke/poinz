import {v4 as uuid} from 'uuid';

import commandSchemaValidator from '../../src/commandSchemaValidator';

/**
 * We don't want to test each schema for every command.
 * Just test that the validator throws on missing command name (schema can not be loaded)
 * Just test that on schema validation error, the validator throws
 */
test('validates successfully ', () => {
  commandSchemaValidator({
    id: uuid(),
    name: 'setUsername',
    roomId: 'some-room',
    payload: {username: 'Thom'}
  });
});

test('throws on invalid command (id missing)', () => {
  expect(() =>
    commandSchemaValidator({
      roomId: 'some-room',
      name: 'setUsername',
      payload: {}
    })
  ).toThrow(/Missing required property: id/);
});

test('throws on invalid command (payload misses property)', () => {
  expect(() =>
    commandSchemaValidator({
      id: uuid(),
      roomId: 'some-room',
      name: 'setUsername',
      payload: {}
    })
  ).toThrow(/Missing required property: username/);
});

test('throws on invalid email', () => {
  expect(() =>
    commandSchemaValidator({
      id: uuid(),
      roomId: 'some-room',
      name: 'setEmail',
      payload: {
        email: 'tisodgjfkjhlk'
      }
    })
  ).toThrow(/Format validation failed \(must be a valid email-address\) in \/payload\/email/);
});

test('throws on invalid roomId', () => {
  expect(() =>
    commandSchemaValidator({
      id: uuid(),
      roomId: 'SomeRoom.?with&invalid¼chars#',
      name: 'joinRoom',
      payload: {}
    })
  ).toThrow(
    /Format validation failed \(must be a valid roomId: only the following characters are allowed: a-z 0-9 _ -\) in \/roomId/
  );
});

test('throws on invalid userId', () => {
  expect(() =>
    commandSchemaValidator({
      id: uuid(),
      roomId: 'custom-room-id',
      name: 'joinRoom',
      userId: 'sdgdgkjslgjslkjglskgjdlksjgl'
    })
  ).toThrow(/Format validation failed \(must be a valid uuid v4\) in \/userId/);
});

test('works with valid userId', () => {
  commandSchemaValidator({
    id: uuid(),
    roomId: 'custom-room-id',
    name: 'joinRoom',
    userId: uuid(),
    payload: {}
  });
});
