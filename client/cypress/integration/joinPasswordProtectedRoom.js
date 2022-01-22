import {nanoid} from 'nanoid';
import {tid} from '../support/commands';
import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
});

it('join random room, open settings, set password. then rejoin room', function () {
  const customRoomName = 'e2e-room-' + nanoid();

  cy.visit('/' + customRoomName);

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);

  Room.TopBar.settingsToggleButton().click();

  Room.Settings.settingsContainer()
    .find(tid('sectionPasswordProtection'))
    .contains('This room is currently not protected');

  Room.Settings.roomPasswordField().type('1234{enter}');

  Room.Settings.settingsContainer()
    .find(tid('sectionPasswordProtection'))
    .contains('This room is protected by a password');

  // reload page, PoinZ displays password input
  cy.visit('/' + customRoomName);

  // no password, just enter
  cy.get(tid('roomPasswordInput')).type('{enter}');
  Room.TopBar.whoami().should('not.exist');

  // wrong password
  cy.get(tid('roomPasswordInput')).type('aaaaa{enter}');
  Room.TopBar.whoami().should('not.exist');

  // correct password
  cy.get(tid('roomPasswordInput')).clear().type('1234{enter}');

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
});
