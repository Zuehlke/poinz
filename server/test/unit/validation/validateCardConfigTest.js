import defaultCardConfig from '../../../src/defaultCardConfig';
import {cardConfigSchema} from '../../../src/commandHandlers/setCardConfig';
import {commandSchemaValidatorFactory} from '../../../src/validation/schemaValidators';

const validate = commandSchemaValidatorFactory({
  command: {},
  setCardConfig: {
    type: 'object',
    properties: {
      cardConfig: cardConfigSchema
    }
  }
});

function validateCardConfig(cc) {
  const dummyCommand = {
    name: 'setCardConfig',
    cardConfig: cc
  };

  try {
    validate(dummyCommand);
  } catch (er) {
    return er.message;
  }
}

test('valid defaultConfig', () => {
  const res = validateCardConfig(defaultCardConfig);

  expect(res).toBeUndefined();
});

test('not an array', () => {
  const res = validateCardConfig({});

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Invalid type: object \(expected array\)/);
});

test('empty array', () => {
  const res = validateCardConfig([]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Array is too short \(0\), minimum 1/);
});

test('additional property', () => {
  const res = validateCardConfig([
    {label: '1', value: 1, color: 'red', additionalProperty: 'someValue'}
  ]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Additional properties not allowed/);
});

test('missing property', () => {
  let res;

  res = validateCardConfig([{label: '1', value: 1}]);
  expect(res).not.toBeFalsy();
  expect(res).toMatch(/Missing required property: color/);

  res = validateCardConfig([{label: '1', color: 'red'}]);
  expect(res).not.toBeFalsy();
  expect(res).toMatch(/Missing required property: value/);

  res = validateCardConfig([{value: 2, color: 'red'}]);
  expect(res).not.toBeFalsy();
  expect(res).toMatch(/Missing required property: label/);
});

test('"value" as string not a Number', () => {
  const res = validateCardConfig([{label: '1', value: 'sfdhsdfhsdfhsdfh', color: 'red'}]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Format validation failed \(Given value is not parseable to a number\)/);
});

test('"value" not a Number (object)', () => {
  const res = validateCardConfig([
    {
      label: '1',
      value: {
        /**...something else **/
      },
      color: 'red'
    }
  ]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Invalid type: object \(expected number\/string\)/);
});

test('"value" a string, but parseable to a Number', () => {
  const res = validateCardConfig([{label: '1', value: '1', color: 'red'}]);

  expect(res).toBeUndefined(); // allow numbers as strings.
});

test('"value" a string, but parseable to a Number', () => {
  const res = validateCardConfig([{label: '1', value: '0.5', color: 'red'}]);

  expect(res).toBeUndefined(); // allow numbers as strings.
});

test('"label" not a String', () => {
  const res = validateCardConfig([{label: {}, value: 1, color: 'red'}]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Invalid type: object \(expected string\)/);
});

test('"color" not a String', () => {
  const res = validateCardConfig([{label: '?', value: 1, color: 3}]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(/Invalid type: number \(expected string\)/);
});

test('duplicate values', () => {
  const res = validateCardConfig([
    {label: '1', value: 1, color: 'red'},
    {label: '2', value: 1, color: 'blue'}
  ]);

  expect(res).not.toBeFalsy();

  expect(res).toMatch(
    /Format validation failed \(CardConfig must not contain two cards with the same value\)/
  );
});
