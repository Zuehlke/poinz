const path = require('path');
const fs = require('fs');

module.exports = parseChangelogMd;

/**
 * Reads our CHANGELOG.md (on repo root level) and parses it.
 * This is used during the webpack build. The array of changelog "items" is made available to the React app via DefinePlugin...
 * The React app can render it (on the landing page, in the help menu)
 *
 * @returns {{date: string, changes: string[], version: string}[]}
 */
function parseChangelogMd() {
  let markdownInput = fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md'), 'utf-8').trim();
  const itemsPlain = markdownInput.split('###').filter((i) => !!i);
  return itemsPlain.map(parseItem);
}

const SEMVER_PATTERN = /(?<version>(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)):/g;
const DATE_PATTERN = /:\s*(?<date>\d{4}-\d{2}-\d{2})/g;

/**
 *
 * @param {string} plainItem
 * @returns {{date: string, changes: string[], version: string}}
 */
function parseItem(plainItem) {
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
  for (const match of input.matchAll(pattern)) {
    if (match.groups[groupName]) {
      return match.groups[groupName];
    }
  }
  return null;
}
