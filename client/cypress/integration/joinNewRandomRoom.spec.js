import {v4 as uuid} from 'uuid';

it('landing page and join new random room', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();

  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');
});

it('create new room (custom name) via landing, then join by url', () => {
  const customRoomName = 'e2e-room-' + uuid();

  cy.visit('/');
  cy.getTID('extendButton').click();
  cy.getTID('customRoomNameInput').type(customRoomName);
  cy.getTID('joinButton').click();

  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');

  // now join by url
  cy.visit('/' + customRoomName);

  cy.getTID('whoamiSimple').contains('e2e-cypress-test-user');
});
