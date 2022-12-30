import {matchAndGetNamedGroup, SEMVER_PATTERN} from '../../parseUtils';

// Note: The semver and date string under test need to start with a space based on the
// results from the CHANGELOG.md after it is parsed

test('parse 0.17.6: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 0.17.6: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('0.17.6');
});

test('parse 0.17.6-XX: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 0.17.6-XX: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('0.17.6-XX');
});

test('parse 10.20.30: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 10.20.30: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('10.20.30');
});

test('parse 1.0.0-alpha: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 1.0.0-alpha: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('1.0.0-alpha');
});

test('parse 1.1.2+meta: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 1.1.2+meta: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('1.1.2+meta');
});

test('parse 0.17.6+meta: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 0.17.6+meta: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe('0.17.6+meta');
});

test('parse 0.17.6.0: 2022-07-09', () => {
  const result = matchAndGetNamedGroup(' 0.17.6.0: 2022-07-09', SEMVER_PATTERN, 'version');
  expect(result).toBe(null);
});