describe('Join Room', () => {

  it('via input field on landing page', () => {
    const roomInputField = element(by.css('.room-id-wrapper input'));
    const roomJoinButton = element(by.css('.room-id-wrapper button'));
    const topBarWhoami = element(by.css('.top-bar .whoami'));

    browser.get('/');

    expect(browser.getTitle()).toEqual('PoinZ');

    roomInputField.sendKeys('foo');
    roomJoinButton.click();

    // set username
    element(by.css('.username-wrapper input#username')).sendKeys('e2eTestUser');
    element(by.css('.username-wrapper .pure-button.button-save')).click();

    expect(browser.getTitle()).toEqual('PoinZ - foo');

    expect(browser.getCurrentUrl()).toContain('/foo'); // url now contains room

    expect(topBarWhoami.getText()).toContain('e2eTestUser@foo');  // top-bar displays room

  });

  it('via url part', () => {
    const topBarWhoami = element(by.css('.top-bar .whoami'));

    browser.get('/bar');

    expect(browser.getCurrentUrl()).toContain('/bar'); // url still set

    // set username
    element(by.css('.username-wrapper input#username')).sendKeys('e2eTestUser');
    element(by.css('.username-wrapper .pure-button.button-save')).click();

    expect(browser.getTitle()).toEqual('PoinZ - bar'); // page title is set

    expect(topBarWhoami.getText()).toContain('e2eTestUser@bar'); // top-bar displays room

  });

});
