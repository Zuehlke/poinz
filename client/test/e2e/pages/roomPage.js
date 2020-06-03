const testUtils = require('../testUtils');
module.exports = {
  goTo,
  addStory,
  selectedStoryElementLocator,
  getSelectedStoryTitle,
  getSelectedStoryDescription
};

function goTo(roomId) {
  return browser.get('/' + roomId);
}

async function addStory(title, description) {
  await testUtils.waitForElement(by.css('.board .backlog .story-add-form'));

  element(by.css('.backlog .story-add-form input')).sendKeys(title);
  element(by.css('.backlog .story-add-form textarea')).sendKeys(description);
  element(by.css('.backlog .story-add-form button')).click();
}

function selectedStoryElementLocator() {
  return by.css('.stories .story-selected');
}

function getSelectedStoryTitle() {
  return element(selectedStoryElementLocator()).element(by.css('h4')).getText();
}

function getSelectedStoryDescription() {
  return element(selectedStoryElementLocator()).element(by.css('.story-text')).getText();
}
