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
    roomId: 'some-Room',
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
