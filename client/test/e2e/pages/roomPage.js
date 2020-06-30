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
  await testUtils.waitForElement(by.css('[data-testid="storyAddForm"]'));

  element(by.css('[data-testid="storyAddForm"] input')).sendKeys(title);
  element(by.css('[data-testid="storyAddForm"] textarea')).sendKeys(description);
  element(by.css('[data-testid="storyAddForm"] button')).click();
}

function selectedStoryElementLocator() {
  return by.css('[data-testid="storySelected"]');
}

function getSelectedStoryTitle() {
  return element(selectedStoryElementLocator()).element(by.css('h4')).getText();
}

function getSelectedStoryDescription() {
  return element(selectedStoryElementLocator())
    .element(by.css('[data-testid="storyText"]'))
    .getText();
}
