import {asTid} from '../support/commands';

it('join new room, add a story with a title and description, modify it', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('storyAddForm', 'input[type="text"]').type('My First Test Story');
  cy.getTID('storyAddForm', 'textarea').type('A Nice description:  http://test.jira.com/ISSUE-123');
  cy.getTID('storyAddForm', 'button').click();

  cy.getTID('backlog').contains('Backlog (1)');
  cy.getTID('backlog').contains('Trash (0)');

  cy.getTID('storySelected', 'h4').contains('My First Test Story');
  cy.getTID('storySelected', asTid('storyText')).contains('A Nice description:');
  cy.getTID('storySelected', asTid('storyText') + ' a'); // dummy jira url is correctly rendered as link ( <a ...> tag)

  cy.getTID('storySelected', asTid('editStoryButton')).click();
  cy.getTID('storySelected', 'input[type="text"]').type('Changed Story Title');
  cy.getTID('storySelected', 'textarea').type('...Changed  http://test.jira.com/ISSUE-456');
  cy.getTID('storySelected', asTid('saveStoryChangesButton')).click();

  // changes are saved
  cy.getTID('storySelected', 'h4').contains('Changed Story Title');
  cy.getTID('storySelected', asTid('storyText')).contains('...Changed');
});

it('join new room, add a story trash it', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('storyAddForm', 'input[type="text"]').type('Story for the trash');
  cy.getTID('storyAddForm', 'textarea').type('will be trashed anyways...');
  cy.getTID('storyAddForm', 'button').click();

  cy.getTID('storySelected', 'h4').contains('Story for the trash');

  cy.getTID('trashStoryButton').click();

  cy.getTID('backlog').contains('Backlog (0)');
  cy.getTID('backlog').contains('Trash (1)');
});
