describe('Join Room', () => {

  it('Join Room via input field on landing page', () => {
    const roomInputField = element(by.css('.room-id-wrapper input'));
    const roomJoinButton =  element(by.css('.room-id-wrapper button'));
    const topBarWhoami = element(by.css('.top-bar .whoami'));

    browser.get('/');

    expect(browser.getTitle()).toEqual('PoinZ');

    roomInputField.sendKeys('foo');
    roomJoinButton.click();

    expect(browser.getTitle()).toEqual('PoinZ - foo');

    expect(browser.getCurrentUrl()).toContain('/foo'); // url now contains room

    expect(topBarWhoami.getText()).toContain('-@foo');  // top-bar displays room

  });

  it('Join Room via url part', () => {
    const topBarWhoami = element(by.css('.top-bar .whoami'));

    browser.get('/bar');

    expect(browser.getCurrentUrl()).toContain('/bar'); // url still set

    expect(browser.getTitle()).toEqual('PoinZ - bar'); // page title is set

    expect(topBarWhoami.getText()).toContain('-@bar'); // top-bar displays room

  });

});
