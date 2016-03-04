describe('Set Username', () => {

  it('set username in user menu', () => {
    browser.get('/bar');

    // no username displayed in top bar
    expect(element(by.css('.top-bar .whoami')).getText()).toContain('-@bar');

    element(by.css('.user-menu-toggle')).click();

    element(by.css('.user-menu input#username')).sendKeys('myNew Username');
    element(by.css('.user-menu button.button-save')).click();

    // top bar now displays username
    expect(element(by.css('.top-bar .whoami')).getText()).toContain('myNew Username@bar');

    // user list (avatars) on board also displays username
    expect(element(by.css('.board .users')).getText()).toContain('myNew Username');
  });

});
