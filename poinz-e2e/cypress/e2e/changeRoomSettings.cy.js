import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
});

it('join room, open settings menu and change room settings', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);
  Room.TopBar.settingsToggleButton().click();

  Room.Settings.autoRevealToggle().click();
  Room.Settings.autoRevealToggle().click();

  Room.Settings.confidenceToggle().click();
  Room.EstimationArea.confidenceButtons();
  Room.Settings.confidenceToggle().click();
  Room.EstimationArea.confidenceButtons().should('not.exist');
});
