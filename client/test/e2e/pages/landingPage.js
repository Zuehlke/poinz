const testUtils = require('../testUtils');

module.exports = {
  goTo,
  createRoomAndSetOwnUsername,
  enterOwnUsername
};

function goTo() {
  return browser.get('/');
}

async function createRoomAndSetOwnUsername(username) {
  element(by.css('[data-testid="joinButton"]')).click();

  await enterOwnUsername(username, browser);
}

async function enterOwnUsername(username, browserInstance) {
  await testUtils.waitForElement(by.css('[data-testid="usernameInput"]'), browserInstance);

  // set username (still landing page, username field displayed since no preset in localstorage)
  browserInstance.element(by.css('[data-testid="usernameInput"]')).sendKeys(username);
  browserInstance.element(by.css('[data-testid="joinButton"]')).click();

  await testUtils.waitForElement(by.css('[data-testid="backlog"]'), browserInstance);
}
