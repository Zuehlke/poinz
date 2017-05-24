import assert from 'assert';
import {v4 as uuid} from 'uuid';

import commandSchemaValidator from '../../src/commandSchemaValidator';

/**
 * We don't want to test each schema for every command.
 * Just test that the validator throws on missing command name (schema can not be loaded)
 * Just test that on schema validation error, the validator throws
 */
describe('commandSchemaValidator', () => {

  it('validates successfully ', () => {
    commandSchemaValidator({
      id: uuid(),
      name: 'setUsername',
      roomId: 'some-Room',
      payload: {userId: '123', username: 'Thom'}
    });
  });

  it('throws on invalid command (id)', () => {
    assert.throws(() =>
      commandSchemaValidator({
        roomId: 'some-room',
        name: 'setUsername',
        payload: {}
      }), /Missing required property: id/);
  });

  it('throws on invalid command (payload)', () => {
    assert.throws(() =>
      commandSchemaValidator({
        id: uuid(),
        roomId: 'some-room',
        name: 'setUsername',
        payload: {}
      }), /Missing required property: userId/);
  });

});
