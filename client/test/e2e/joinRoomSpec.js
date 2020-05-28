const landingPage = require('./pages/landingPage');

describe('Join Room', () => {
  it('directly via url', async () => {
    // first a room must exist...

    landingPage.goTo();
    landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    // now get assigned (random, unique) roomId from url
    const url = await browser.getCurrentUrl();
    const roomId = url.substring(url.lastIndexOf('/') + 1);

    browser.get('/' + roomId);

    expect(browser.getTitle()).toEqual('PoinZ - ' + roomId); // page title is set

    expect(element(by.css('.top-bar .quick-menu .whoami-simple')).getText()).toContain(
      'e2eTestUser'
    ); // top-bar displays room
  });
});
