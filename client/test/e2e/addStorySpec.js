describe('Add Story', () => {

  it('via form', () => {
    browser.get('/bar');

    // set username
    element(by.css('.username-wrapper input#username')).sendKeys('e2eTestUser');
    element(by.css('.username-wrapper .pure-button.button-save')).click();

    element(by.css('.backlog textarea')).sendKeys('A description');
    element(by.css('.backlog .pure-form button')).click();

  });

});
