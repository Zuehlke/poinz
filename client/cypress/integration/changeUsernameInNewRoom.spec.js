it('join room, open user menu and change username', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();
  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');

  cy.getTID('topBar');
  cy.getTID('userMenuToggle').click();
  cy.getTID('usernameInput').type('{selectall}changed username');
  cy.getTID('saveUsernameButton').click();

  cy.getTID('whoamiSimple').contains('changed username');
  cy.getTID('users').contains('changed username');
});
