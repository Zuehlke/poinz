
it('landing page and join new random room', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();
  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');
});
