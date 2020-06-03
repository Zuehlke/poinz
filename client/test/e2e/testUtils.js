const until = protractor.ExpectedConditions;
const fs = require('fs');

module.exports = {
  saveScreenShotOf,
  waitForElement
};

function saveScreenShotOf(elementRef, filename = 'e2eScreenshot.png') {
  elementRef.takeScreenshot().then((png) => {
    writeScreenShot(png, filename);
  });
}

function writeScreenShot(data, filename) {
  const stream = fs.createWriteStream(filename);
  stream.write(Buffer.from(data, 'base64'));
  stream.end();
}

async function waitForElement(locator, browserInstance = browser) {
  const elementRef = browserInstance.element(locator);
  await browserInstance.wait(
    until.presenceOf(elementRef),
    5000,
    `Element "${locator.value} (using ${locator.using})" taking too long to appear in the DOM`
  );
}
