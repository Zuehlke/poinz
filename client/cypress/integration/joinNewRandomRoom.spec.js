const BASE_URL = 'http://localhost:9000';

it('landing page and join new random room', () => {
  cy.visit(BASE_URL);
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();
  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');
});
