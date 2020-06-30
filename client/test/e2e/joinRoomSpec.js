const landingPage = require('./pages/landingPage');

describe('Join Room', () => {
  it('directly via url', async () => {
    // first a room must exist...

    landingPage.goTo();
    await landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    // now get assigned (random, unique) roomId from url
    const url = await browser.getCurrentUrl();
    const roomId = url.substring(url.lastIndexOf('/') + 1);

    browser.get('/' + roomId);

    // top-bar displays username
    expect(element(by.css('[data-testid="whoamiSimple"]')).getText()).toContain('e2eTestUser');
  });
});
