const landingPage = require('./pages/landingPage');
const testUtils = require('./testUtils');

describe('Set Username', () => {
  it('in user menu', () => {
    landingPage.goTo();
    landingPage.createRoomAndSetOwnUsername('e2eTestUser');

    testUtils.waitForElement(by.css('[data-testid="topBar"]'));

    element(by.css('[data-testid="userMenuToggle"]')).click();

    element(by.css('[data-testid="usernameInput"]')).sendKeys('myNew Username');
    element(by.css('[data-testid="saveUsernameButton"]')).click();

    // top bar now displays username
    expect(element(by.css('[data-testid="whoamiSimple"]')).getText()).toContain('myNew Username');

    // user list (avatars) on board also displays username
    expect(element(by.css('[data-testid="users"]')).getText()).toContain('myNew Username');
  });
});
