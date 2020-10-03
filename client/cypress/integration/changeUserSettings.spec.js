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
  cy.get(tid('userMenuToggle')).click();

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
  cy.get(tid('userMenu') + ' #language-selector-de').click();
  cy.get(tid('userMenu')).contains('Benutzername');
  cy.get(tid('userMenu') + ' #language-selector-en').click();
  cy.get(tid('userMenu')).contains('Username');

  // -- select another avatar (user image)
  cy.get(tid('userMenu', 'avatarGrid') + ' img:nth-child(4)').click();

  // -- set gravatar email address
  cy.get(tid('userMenu', 'gravatarEmailInput')).type(this.user.email);
  cy.get(tid('saveEmailButton')).click();
  cy.wait(400);
  cy.get(tid('userMenu', 'gravatarEmailInput')).clear().type(this.sergio.email);
  cy.get(tid('saveEmailButton')).click();

  // -- mark as excluded / included
  cy.get(tid('userMenu', 'excludedToggle')).click();
  cy.get(tid('userMenu', 'excludedToggle')).click();
});
