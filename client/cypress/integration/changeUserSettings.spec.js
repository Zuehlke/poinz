import {asTid} from '../support/commands';

it('join room, open user menu and change settings', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();
  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');

  cy.getTID('topBar');
  cy.getTID('userMenuToggle').click();

  // -- set a new username
  cy.getTID('usernameInput').type('{selectall}changed username');
  cy.getTID('saveUsernameButton').click();

  cy.getTID('whoamiSimple').contains('changed username');
  cy.getTID('users').contains('changed username');

  // -- switch language
  cy.getTID('userMenu', '#language-selector-de').click();
  cy.getTID('userMenu').contains('Benutzername');
  cy.getTID('userMenu', '#language-selector-en').click();
  cy.getTID('userMenu').contains('Username');

  // -- select another avatar (user image)
  cy.getTID('userMenu', asTid('avatarGrid') + ' img:nth-child(4)').click();

  // -- set gravatar email address
  cy.getTID('userMenu', asTid('gravatarEmailInput')).type('test@gmail.com');
  cy.getTID('saveEmailButton').click();

  // -- mark as excluded / included
  cy.getTID('userMenu', asTid('excludedToggle')).click();
  cy.getTID('userMenu', asTid('excludedToggle')).click();
});
