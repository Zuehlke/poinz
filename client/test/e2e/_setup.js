/**
 * Make sure that before each test, we clear the localStorage that might contain preset username/email/id
 */
beforeEach(function () {
  browser.get('/');
  browser.executeScript('window.localStorage.clear();');
});
