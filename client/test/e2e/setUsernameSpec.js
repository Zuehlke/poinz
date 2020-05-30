const landingPage = require('./pages/landingPage');

describe('Set Username', () => {
  it('in user menu', () => {
    landingPage.goTo();
    landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    element(by.css('.user-menu-toggle')).click();

    element(by.css('.user-menu input#username')).sendKeys('myNew Username');
    element(by.css('.user-menu button.button-save.button-save-username')).click();

    // top bar now displays username
    expect(element(by.css('.top-bar .whoami-simple')).getText()).toContain('myNew Username');

    // user list (avatars) on board also displays username
    expect(element(by.css('.board .users')).getText()).toContain('myNew Username');
  });
});
