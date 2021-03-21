import {tid} from '../support/commands';
import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
});

it('join room, open settings menu and change user settings', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
  Room.TopBar.settingsToggleButton().click();

  // -- set a new username
  Room.Settings.usernameField().clear().type(this.sergio.username);
  Room.Settings.saveUsernameButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.sergio.username);
  Room.TopBar.logo().click(); // hide whoami dropdown
  cy.get(tid('users')).contains(this.sergio.username);

  Room.Settings.usernameField().type(' whitespace (allowed)');
  Room.Settings.saveUsernameButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(' whitespace (allowed)');
  Room.TopBar.logo().click(); // hide whoami dropdown
  cy.get(tid('users')).contains(' whitespace (allowed)');

  // -- switch language
  Room.Settings.settingsContainer().find('#language-selector-de').click();
  Room.Settings.settingsContainer().contains('Benutzername');
  Room.Settings.settingsContainer().find('#language-selector-en').click();
  Room.Settings.settingsContainer().contains('Username');

  // -- select another avatar (user image)
  Room.Settings.settingsContainer()
    .find(tid('avatarGrid') + ' img:nth-child(4)')
    .click();

  // -- set gravatar email address
  Room.Settings.settingsContainer().find(tid('gravatarEmailInput')).type(this.user.email);
  cy.get(tid('saveEmailButton')).click();
  cy.wait(400);
  Room.Settings.settingsContainer().find(tid('gravatarEmailInput')).clear().type(this.sergio.email);
  cy.get(tid('saveEmailButton')).click();

  // -- mark as excluded / included
  Room.Settings.settingsContainer().find(tid('excludedToggle')).click();
  Room.Settings.settingsContainer().find(tid('excludedToggle')).click();
});
