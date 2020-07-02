const BASE_URL = 'http://localhost:9000';

import {asTid} from '../support/commands';

it('join new room, add a story with a title and description', () => {
  cy.visit(BASE_URL);
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('storyAddForm', 'input[type="text"]').type('My First Test Story');
  cy.getTID('storyAddForm', 'textarea').type('A Nice description:  http://test.jira.com/ISSUE-123');
  cy.getTID('storyAddForm', 'button').click();

  cy.getTID('storySelected', 'h4').contains('My First Test Story');
  cy.getTID('storySelected', asTid('storyText')).contains('A Nice description:');
  cy.getTID('storySelected', asTid('storyText') + ' a'); // dummy jira url is correctly rendered as link ( <a ...> tag)
});
