import {v4 as uuid} from 'uuid';
import {tid} from '../support/commands';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
});

it('landing page and join new random room', function () {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains(this.user.username);
});

it('create new room (custom name) via landing, then join by url', function () {
  const customRoomName = 'e2e-room-' + uuid();

  cy.visit('/');
  cy.get(tid('extendButton')).click();
  cy.get(tid('customRoomNameInput')).type(customRoomName);
  cy.get(tid('joinButton')).click();

  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains(this.user.username);

  // now join the new room by url
  cy.visit('/' + customRoomName);

  // since we are in the same cypress test, localStorage has our username preset, no need to enter it
  cy.get(tid('whoamiSimple')).contains(this.user.username);
});

it('create new room (custom name) on the fly when joining by url', function () {
  const customRoomName = 'e2e-room-' + uuid();

  cy.clearLocalStorage(); // this should not be needed.  Cypress promises to clear all local storage in between tests.
  // however, here, when joining  a new room by url, I get a lot of "joinCommands" that contain the username -> PoinZ does not show the username prompt, and the .type on line 45 will fail.

  cy.visit('/' + customRoomName);

  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains(this.user.username);
});

it('create new room (whitespace room name) by url', function () {
  const randomId = uuid();
  const customRoomName = 'this works now' + randomId;

  cy.visit('/' + customRoomName);

  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple')).contains(this.user.username);

  cy.url().should('contain', 'this-works-now' + randomId);
});
