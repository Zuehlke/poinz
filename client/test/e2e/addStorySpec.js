describe('Add Story', () => {

  it('Add plain story', () => {
    browser.get('/bar');

    element(by.css('.backlog input')).sendKeys('Story 222');
    element(by.css('.backlog textarea')).sendKeys('A description');
    element(by.css('.backlog .pure-form button')).click();

  });

});
