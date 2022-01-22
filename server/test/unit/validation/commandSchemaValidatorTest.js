import uuid from '../../../src/uuid';
import {
  commandSchemaValidatorFactory,
  getSchemasFromRealCommandHandlers
} from '../../../src/validation/schemaValidators';
import realCmdHandlers, {baseCommandSchema} from '../../../src/commandHandlers/commandHandlers';

const realSchemas = getSchemasFromRealCommandHandlers(realCmdHandlers);
realSchemas.command = baseCommandSchema;

/**
 * We don't want to test each schema for every command.
 * Just test that the validator throws on missing command name (schema can not be loaded)
 * Just test that on schema validation error, the validator throws
 */
test('validates successfully with real (production poinz) schemas', () => {
  const validate = commandSchemaValidatorFactory(realSchemas);

  validate({
    id: uuid(),
    name: 'setUsername',
    roomId: 'some-room',
    payload: {username: 'Thom'}
  });
});

test('throws on invalid command (id missing)', () => {
  const validate = commandSchemaValidatorFactory({
    superCommand: {
      allOf: [
        {
          $ref: 'command'
        }
      ]
    },
    command: baseCommandSchema
  });

  expect(() =>
    validate({
      roomId: 'some-room',
      name: 'superCommand',
      payload: {}
    })
  ).toThrow(/Missing required property: id/);
});

test('throws on invalid command (payload misses property)', () => {
  const validate = commandSchemaValidatorFactory({
    superCommand: {
      allOf: [
        {
          $ref: 'command'
        },
        {
          properties: {
            payload: {
              type: 'object',
              properties: {
                superProperty: {
                  type: 'string'
                }
              },
              required: ['superProperty'],
              additionalProperties: false
            }
          }
        }
      ]
    },
    command: baseCommandSchema
  });
  expect(() =>
    validate({
      id: uuid(),
      roomId: 'some-room',
      name: 'superCommand',
      payload: {}
    })
  ).toThrow(/Missing required property: superProperty/);
});

test('throws on invalid email', () => {
  const validate = commandSchemaValidatorFactory({
    emailCommand: {
      properties: {
        email: {
          type: 'string',
          format: 'email'
        }
      }
    },
    command: baseCommandSchema
  });
  expect(() =>
    validate({
      id: uuid(),
      roomId: 'some-room',
      name: 'emailCommand',
      email: 'tisodgjfkjhlk'
    })
  ).toThrow(/Format validation failed \(must be a valid email-address\) in \/email/);
});

test('throws on invalid roomId', () => {
  const validate = commandSchemaValidatorFactory({
    commandReferencingBase: {
      allOf: [
        {
          $ref: 'command'
        }
      ]
    },
    command: baseCommandSchema
  });
  expect(() =>
    validate({
      id: uuid(),
      roomId: 'SomeRoom.?with&invalid¼chars#',
      name: 'commandReferencingBase',
      payload: {}
    })
  ).toThrow(
    /Format validation failed \(must be a valid roomId: only the following characters are allowed: a-z 0-9 _ -\) in \/roomId/
  );
});

test('must not throw with valid uuid v4 (lowercase)', () => {
  const validate = commandSchemaValidatorFactory(realSchemas);

  validate({
    id: uuid(),
    name: 'joinRoom',
    roomId: 'some-room',
    userId: '3c33b123-b2d9-4444-8cc3-1287c670f755',
    payload: {username: 'Thom'}
  });
});

test('throws on invalid userId', () => {
  const validate = commandSchemaValidatorFactory({
    commandReferencingBase: {
      allOf: [
        {
          $ref: 'command'
        }
      ]
    },
    command: baseCommandSchema
  });
  expect(() =>
    validate({
      id: uuid(),
      roomId: 'custom-room-id',
      name: 'commandReferencingBase',
      userId: 'sdgdgkjslgjslkjglskgjdlksjgl',
      payload: {}
    })
  ).toThrow(/Format validation failed \(must be a valid nanoid or uuid v4\) in \/userId/);
});

test('throws on roomId with uppercase characters', () => {
  const validate = commandSchemaValidatorFactory({
    commandReferencingBase: {
      allOf: [
        {
          $ref: 'command'
        }
      ]
    },
    command: baseCommandSchema
  });
  expect(() =>
    validate({
      id: uuid(),
      roomId: 'cuAstom-room-ifd',
      name: 'commandReferencingBase',
      userId: uuid(),
      payload: {}
    })
  ).toThrow(
    /Format validation failed \(must be a valid roomId: only the following characters are allowed: a-z 0-9 _ -\) in \/roomId/
  );
});

test('works with valid userId', () => {
  const validate = commandSchemaValidatorFactory({
    commandReferencingBase: {
      allOf: [
        {
          $ref: 'command'
        }
      ]
    },
    command: baseCommandSchema
  });
  validate({
    id: uuid(),
    roomId: 'custom-room-id',
    name: 'commandReferencingBase',
    userId: uuid(),
    payload: {}
  });
});
