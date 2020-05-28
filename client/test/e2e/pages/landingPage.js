const until = protractor.ExpectedConditions;

module.exports = {
  goTo,
  createRoomAndSetOwnUsername
};

function goTo() {
  return browser.get('/');
}

function createRoomAndSetOwnUsername(username) {
  element(by.css('.create-room-button')).click();

  browser.wait(
    until.presenceOf(element(by.css('.username-wrapper'))),
    5000,
    'Element taking too long to appear in the DOM'
  );

  // set username (still landing page, username field displayed since no preset in localstorage)
  element(by.css('.username-wrapper input#username')).sendKeys(username);
  element(by.css('.username-wrapper .pure-button.button-save')).click();
}
