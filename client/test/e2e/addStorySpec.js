const testUtils = require('./testUtils');
const landingPage = require('./pages/landingPage');
const roomPage = require('./pages/roomPage');

describe('Add Story', () => {
  it('via form', () => {
    landingPage.goTo();
    landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    roomPage.addStory('A Story Title', 'A description');

    testUtils.waitForElement(roomPage.selectedStoryElementLocator());

    expect(roomPage.getSelectedStoryTitle()).toEqual('A Story Title');
    expect(roomPage.getSelectedStoryDescription()).toEqual('A description');
  });
});
