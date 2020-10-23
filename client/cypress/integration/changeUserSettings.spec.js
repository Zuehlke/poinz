import {tid} from '../support/commands';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
});

it('join room, open user menu and change settings', function () {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();
  cy.get(tid('whoamiSimple')).contains(this.user.username);

  cy.get(tid('topBar'));
  cy.get(tid('settingsToggle')).click();

  // -- set a new username
  cy.get(tid('usernameInput')).clear().type(this.sergio.username);
  cy.get(tid('saveUsernameButton')).click();

  cy.get(tid('whoamiSimple')).contains(this.sergio.username);
  cy.get(tid('users')).contains(this.sergio.username);

  cy.get(tid('usernameInput')).type(' whitespace (allowed)');
  cy.get(tid('saveUsernameButton')).click();

  cy.get(tid('whoamiSimple')).contains(' whitespace (allowed)');
  cy.get(tid('users')).contains(' whitespace (allowed)');

  // -- switch language
  cy.get(tid('settings') + ' #language-selector-de').click();
  cy.get(tid('settings')).contains('Benutzername');
  cy.get(tid('settings') + ' #language-selector-en').click();
  cy.get(tid('settings')).contains('Username');

  // -- select another avatar (user image)
  cy.get(tid('settings', 'avatarGrid') + ' img:nth-child(4)').click();

  // -- set gravatar email address
  cy.get(tid('settings', 'gravatarEmailInput')).type(this.user.email);
  cy.get(tid('saveEmailButton')).click();
  cy.wait(400);
  cy.get(tid('settings', 'gravatarEmailInput')).clear().type(this.sergio.email);
  cy.get(tid('saveEmailButton')).click();

  // -- mark as excluded / included
  cy.get(tid('settings', 'excludedToggle')).click();
  cy.get(tid('settings', 'excludedToggle')).click();
});
