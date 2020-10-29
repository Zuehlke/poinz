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

  cy.get(tid('whoamiSimple')).contains(this.user.username);
});

it('create new room (custom name) on the fly when joining by url', function () {
  const customRoomName = 'e2e-room-' + uuid();

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
