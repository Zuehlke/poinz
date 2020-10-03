import {tid} from '../support/commands';

it('load page with mobile screen dimensions and toggle menues in room', () => {
  cy.viewport('iphone-x');
  cy.visit('/');

  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  cy.get(tid('backlogToggle')).click(); // show backlog

  cy.get(tid('storyAddForm') + ' input[type="text"]').type(
    'This is visibile. I could add a story...'
  );

  cy.get(tid('userMenuToggle')).click(); // show userMenu (settings)  will hide backlog

  cy.get(tid('usernameInput')).type('{selectall}could-change-username');

  cy.get(tid('actionLogToggle')).click(); // show log (actions)  will hide usermenu

  cy.wait(200);

  cy.get(tid('actionLogToggle')).click(); // hide log again
});
