const until = protractor.ExpectedConditions;

const landingPage = require('./pages/landingPage');
const roomPage = require('./pages/roomPage');

describe('Add Story', () => {
  it('via form', () => {
    landingPage.goTo();
    landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    roomPage.addStory('A Story Title', 'A description');

    browser.wait(
      until.presenceOf(roomPage.selectedStoryElement()),
      5000,
      'Element taking too long to appear in the DOM'
    );

    expect(roomPage.getSelectedStoryTitle()).toEqual('A Story Title');
    expect(roomPage.getSelectedStoryDescription()).toEqual('A description');
  });
});
