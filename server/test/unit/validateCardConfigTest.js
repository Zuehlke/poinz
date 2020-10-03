import {validateCardConfig} from '../../src/commandSchemaValidator';
import defaultCardConfig from '../../src/defaultCardConfig';

test('valid defaultConfig', () => {
  const res = validateCardConfig(defaultCardConfig);

  expect(res).toBeUndefined();
});

test('not an array', () => {
  const res = validateCardConfig({});

  expect(res).not.toBeFalsy();

  expect(res).toBe('Given cardConfig is not an array!');
});

test('empty array', () => {
  const res = validateCardConfig([]);

  expect(res).not.toBeFalsy();

  expect(res).toBe('Given cardConfig must not be an empty array!');
});

const propErrorMsg =
  'A card in cardConfig must be an object with these exact 3 properties "color", "label" and "value"';

test('additional property', () => {
  const res = validateCardConfig([
    {label: '1', value: 1, color: 'red', additionalProperty: 'someValue'}
  ]);

  expect(res).not.toBeFalsy();

  expect(res).toBe(propErrorMsg);
});

test('missing property', () => {
  let res;

  res = validateCardConfig([{label: '1', value: 1}]);
  expect(res).not.toBeFalsy();
  expect(res).toBe(propErrorMsg);

  res = validateCardConfig([{label: '1', color: 'red'}]);
  expect(res).not.toBeFalsy();
  expect(res).toBe(propErrorMsg);

  res = validateCardConfig([{value: 2, color: 'red'}]);
  expect(res).not.toBeFalsy();
  expect(res).toBe(propErrorMsg);
});

test('"value" not a Number', () => {
  const res = validateCardConfig([{label: '1', value: 'sfdhsdfhsdfhsdfh', color: 'red'}]);

  expect(res).not.toBeFalsy();

  expect(res).toBe('Property "value" on a card in cardConfig must be a number');
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

  expect(res).toBe('Property "value" on a card in cardConfig must be a number');
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

  expect(res).toBe('Property "label" on a card in cardConfig must be a string');
});

test('"color" not a String', () => {
  const res = validateCardConfig([{label: '?', value: 1, color: 3}]);

  expect(res).not.toBeFalsy();

  expect(res).toBe('Property "color" on a card in cardConfig must be a string');
});

test('duplicate values', () => {
  const res = validateCardConfig([
    {label: '1', value: 1, color: 'red'},
    {label: '2', value: 1, color: 'blue'}
  ]);

  expect(res).not.toBeFalsy();

  expect(res).toBe('CardConfig must not contain two cards with the same value');
});
