import {tid} from '../support/commands';

it('join room, open user menu and change settings', () => {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();
  cy.get(tid('whoamiSimple')).contains('e2e-cypress-test-user');

  cy.get(tid('topBar'));
  cy.get(tid('userMenuToggle')).click();

  // -- set a new username
  cy.get(tid('usernameInput')).type('{selectall}changed-username');
  cy.get(tid('saveUsernameButton')).click();

  cy.get(tid('whoamiSimple')).contains('changed-username');
  cy.get(tid('users')).contains('changed-username');

  // -- switch language
  cy.get(tid('userMenu') + ' #language-selector-de').click();
  cy.get(tid('userMenu')).contains('Benutzername');
  cy.get(tid('userMenu') + ' #language-selector-en').click();
  cy.get(tid('userMenu')).contains('Username');

  // -- select another avatar (user image)
  cy.get(tid('userMenu', 'avatarGrid') + ' img:nth-child(4)').click();

  // -- set gravatar email address
  cy.get(tid('userMenu', 'gravatarEmailInput')).type('test@gmail.com');
  cy.get(tid('saveEmailButton')).click();

  // -- mark as excluded / included
  cy.get(tid('userMenu', 'excludedToggle')).click();
  cy.get(tid('userMenu', 'excludedToggle')).click();
});
