import {tid} from '../support/commands';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
});

it('load page with mobile screen dimensions and toggle menues in room', function () {
  cy.viewport('iphone-x');
  cy.visit('/');

  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('backlogToggle')).click(); // show backlog

  cy.get(tid('storyAddForm') + ' input[type="text"]').type(
    'This is visibile. I could add a story...'
  );

  cy.get(tid('userMenuToggle')).click(); // show userMenu (settings)  will hide backlog

  cy.get(tid('usernameInput')).type('{selectall}can type in here');

  cy.get(tid('actionLogToggle')).click(); // show log (actions)  will hide usermenu

  cy.wait(200);

  cy.get(tid('actionLogToggle')).click(); // hide log again
});
