import {nanoid} from 'nanoid';
import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
});

it('landing page and join new random room', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
});

it('create new room (custom name) via landing, then join by url', function () {
  const customRoomName = 'e2e-room-' + nanoid();

  cy.visit('/');
  Landing.extendButton().click();
  Landing.customRoomNameField().type(customRoomName);
  Landing.joinButton().click();

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);

  // now join the new room by url
  cy.visit('/' + customRoomName);

  // since we are in the same cypress test, localStorage has our username preset, no need to enter it
  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
});

it('create new room (custom name) on the fly when joining by url', function () {
  const customRoomName = 'e2e-room-' + nanoid();

  cy.clearLocalStorage(); // this should not be needed.  Cypress promises to clear all local storage in between tests.
  // however, here, when joining  a new room by url, I get a lot of "joinCommands" that contain the username -> PoinZ does not show the username prompt, and the .type on line 47 will fail.

  cy.visit('/' + customRoomName);

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
});

it('create new room (whitespace room name) by url', function () {
  const randomId = nanoid();
  const customRoomName = 'this works now' + randomId;

  cy.visit('/' + customRoomName);

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);

  cy.url().should('contain', 'this-works-now' + randomId.toLowerCase()); // Note:  our client will transform the manually entered roomId (in the url) to lowercase
});
