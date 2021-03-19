import {tid} from '../support/commands';
import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
});

it('load page with mobile screen dimensions and toggle menues in room', function () {
  cy.viewport('iphone-x');
  cy.visit('/');

  cy.clearLocalStorage(); // this should not be needed.  Cypress promises to clear all local storage in between tests.

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  cy.get(tid('backlogToggle')).click(); // show backlog

  Room.Backlog.StoryAddForm.titleField().type('This is visibile. I could add a story...');

  cy.get(tid('settingsToggle')).click(); // show settings, will hide backlog

  cy.get(tid('usernameInput')).type('{selectall}can type in here');

  cy.get(tid('actionLogToggle')).click(); // show log (actions)  will hide settings

  cy.wait(200);

  cy.get(tid('actionLogToggle')).click(); // hide log again
});
