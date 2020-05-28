module.exports = {
  goTo,
  addStory,
  selectedStoryElement,
  getSelectedStoryTitle,
  getSelectedStoryDescription
};

function goTo(roomId) {
  return browser.get('/' + roomId);
}

function addStory(title, description) {
  element(by.css('.backlog .story-add-form input')).sendKeys(title);
  element(by.css('.backlog .story-add-form textarea')).sendKeys(description);
  element(by.css('.backlog .story-add-form button')).click();
}

function selectedStoryElement() {
  return element(by.css('.stories .story-selected'));
}

function getSelectedStoryTitle() {
  return selectedStoryElement().element(by.css('h4')).getText();
}

function getSelectedStoryDescription() {
  return selectedStoryElement().element(by.css('.story-text')).getText();
}
