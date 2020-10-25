const path = require('path');
const fs = require('fs');

module.exports = readChangelogToHtml;

function readChangelogToHtml() {
  let content = fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md'), 'utf-8').trim();

  content = content.replace(/###[ ]?([0-9 :\.-]+)\n/gi, '<li><h1>$1</h1>\n<ul>');
  content = content.replace(/\* ([A-Z0-9 \._,'\(\)\/\-&"'=:!]+)/gi, '<li>$1</li>');
  content = content.replace(/\n<li><h1>/gim, '</ul>\n<li><h1>');

  content = `<h4>Changelog</h4><ul>${content}</ul></li></ul>`;
  return content;
}

readChangelogToHtml();
