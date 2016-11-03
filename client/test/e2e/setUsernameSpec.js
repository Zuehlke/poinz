describe('Set Username', () => {

  it('in user menu', () => {
    browser.get('/bar');

    // set username
    element(by.css('.username-wrapper input#username')).sendKeys('e2eTestUser');
    element(by.css('.username-wrapper .pure-button.button-save')).click();

    // no username displayed in top bar
    expect(element(by.css('.top-bar .whoami')).getText()).toContain('e2eTestUser@bar');

    element(by.css('.user-menu-toggle')).click();

    element(by.css('.user-menu input#username')).sendKeys('myNew Username');
    element(by.css('.user-menu button.button-save.button-save-username')).click();

    // top bar now displays username
    expect(element(by.css('.top-bar .whoami')).getText()).toContain('myNew Username@bar');

    // user list (avatars) on board also displays username
    expect(element(by.css('.board .users')).getText()).toContain('myNew Username');
  });

});
