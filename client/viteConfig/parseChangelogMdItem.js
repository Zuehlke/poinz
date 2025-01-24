/* SemVer Pattern based on Semantic Versioning 2.0.0 (https://semver.org/spec/v2.0.0.html) and
 * https://regex101.com/r/vkijKf/1/
 */
const SEMVER_PATTERN =
  /(?<version>^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?):/g;
const DATE_PATTERN = /:\s*(?<date>\d{4}-\d{2}-\d{2})/g;

/**
 *
 * @param {string} plainItem
 * @returns {{date: string, changes: string[], version: string}}
 */
export function parseChangelogMdItem(plainItem) {
  const version = matchAndGetNamedGroup(plainItem, SEMVER_PATTERN, 'version');
  if (!version) {
    throw new Error('Could not parse CHANGELOG.md : item has no valid semver version!');
  }
  const date = matchAndGetNamedGroup(plainItem, DATE_PATTERN, 'date');
  if (!date) {
    throw new Error('Could not parse CHANGELOG.md : item has no valid date');
  }

  // -- items (* list)
  const asteriskLines = plainItem.split(/\r?\n/).filter((l) => l.substring(0, 2) === '* ');

  return {
    version,
    date,
    changes: asteriskLines.map((l) => l.substring(2))
  };
}

function matchAndGetNamedGroup(input, pattern, groupName) {
  for (const match of input.trim().matchAll(pattern)) {
    if (match.groups[groupName]) {
      return match.groups[groupName];
    }
  }
  return null;
}
