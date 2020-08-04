import {v4 as uuid} from 'uuid';
import {tid} from '../support/commands';

it('landing page and join new random room', () => {
  cy.visit('/');
  cy.get(tid('joinButton')).click();

  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains('e2e-cypress-test-user');
});

it('create new room (custom name) via landing, then join by url', () => {
  const customRoomName = 'e2e-room-' + uuid();

  cy.visit('/');
  cy.get(tid('extendButton')).click();
  cy.get(tid('customRoomNameInput')).type(customRoomName);
  cy.get(tid('joinButton')).click();

  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains('e2e-cypress-test-user');

  // now join by url
  cy.visit('/' + customRoomName);

  cy.get(tid('whoamiSimple')).contains('e2e-cypress-test-user');
});
