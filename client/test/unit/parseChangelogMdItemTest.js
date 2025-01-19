import {parseChangelogMdItem} from '../../viteConfig/parseChangelogMdItem';

// Note: The semver and date string under test need to start with a space based on the
// results from the CHANGELOG.md after it is parsed

test('parse 0.17.6: 2022-09-18', () => {
  const result = parseChangelogMdItem(` 0.17.6: 2022-09-18

* dependencies updated

`);

  expect(result.version).toBe('0.17.6');
  expect(result.date).toBe('2022-09-18');
});

test('parse 0.17.6-XX: 2022-10-09', () => {
  const result = parseChangelogMdItem(` 0.17.6-XX: 2022-10-09

* dependencies updated

`);

  expect(result.version).toBe('0.17.6-XX');
  expect(result.date).toBe('2022-10-09');
});

test('parse 10.20.30: 2022-07-09', () => {
  const result = parseChangelogMdItem(` 10.20.30: 2022-07-09

* dependencies updated

`);

  expect(result.version).toBe('10.20.30');
});

test('parse 1.0.0-alpha: 2022-07-09', () => {
  const result = parseChangelogMdItem(` 1.0.0-alpha: 2022-07-09

* dependencies updated

`);

  expect(result.version).toBe('1.0.0-alpha');
});

test('parse 1.1.2+meta: 2022-07-09', () => {
  const result = parseChangelogMdItem(` 1.1.2+meta: 2022-07-09

* dependencies updated

`);

  expect(result.version).toBe('1.1.2+meta');
});

test('parse 0.17.6+meta: 2022-07-09', () => {
  const result = parseChangelogMdItem(` 0.17.6+meta: 2022-07-09

* dependencies updated

`);

  expect(result.version).toBe('0.17.6+meta');
});

test('parse 0.17.6.0: 2022-07-09', () => {
  expect(() => {
    parseChangelogMdItem(` 0.17.6.0: 2022-07-09

* dependencies updated

`);
  }).toThrow(/^Could not parse CHANGELOG.md : item has no valid semver version!$/);
});

test('parse 0.17.6: 2022-7-09', () => {
  expect(() => {
    parseChangelogMdItem(` 0.17.6: 2022-7-09

* dependencies updated

`);
  }).toThrow(/^Could not parse CHANGELOG.md : item has no valid date$/);
});

test('parse 0.17.6: 2022-07-9', () => {
  expect(() => {
    parseChangelogMdItem(` 0.17.6: 2022-07-9

* dependencies updated

`);
  }).toThrow(/^Could not parse CHANGELOG.md : item has no valid date$/);
});
