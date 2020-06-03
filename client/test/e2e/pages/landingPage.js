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
  element(by.css('.create-room-button')).click();

  await enterOwnUsername(username, browser);
}

async function enterOwnUsername(username, browserInstance) {
  await testUtils.waitForElement(by.css('.username-wrapper'), browserInstance);

  // set username (still landing page, username field displayed since no preset in localstorage)
  browserInstance.element(by.css('.username-wrapper input#username')).sendKeys(username);
  browserInstance.element(by.css('.username-wrapper .pure-button.button-save')).click();

  await testUtils.waitForElement(by.css('.board .backlog'), browserInstance);
}
