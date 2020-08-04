import {tid} from '../support/commands';

it('join new room, add a story with a title and description, modify it', () => {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  cy.get(tid('storyAddForm') + ' input[type="text"]').type('My First Test Story');
  cy.get(tid('storyAddForm') + ' textarea').type(
    'A Nice description:  http://test.jira.com/ISSUE-123'
  );
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('backlog')).contains('Backlog (1)');
  cy.get(tid('backlog')).contains('Trash (0)');

  cy.get(tid('storySelected') + ' h4').contains('My First Test Story');
  cy.get(tid('storySelected', 'storyText')).contains('A Nice description:');
  cy.get(tid('storySelected', 'storyText') + ' a'); // dummy jira url in description is correctly rendered as link ( <a ...> tag)

  cy.get(tid('storySelected', 'editStoryButton')).click();
  cy.get(tid('storySelected') + ' input[type="text"]').type('Changed Story Title');
  cy.get(tid('storySelected') + ' textarea').type('...Changed  http://test.jira.com/ISSUE-456');
  cy.get(tid('storySelected', 'saveStoryChangesButton')).click();

  // changes are saved
  cy.get(tid('storySelected') + ' h4').contains('Changed Story Title');
  cy.get(tid('storySelected', 'storyText')).contains('...Changed');
});

it('join new room, add a story trash it, restore it, trash it again and delete it', () => {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  // add a story
  cy.get(tid('storyAddForm') + ' input[type="text"]').type('Story for the trash');
  cy.get(tid('storyAddForm') + ' textarea').type('will be trashed anyways...');
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('storySelected') + ' h4').contains('Story for the trash');

  // trash it
  cy.get(tid('trashStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (0)');
  cy.get(tid('backlog')).contains('Trash (1)');

  // restore it
  cy.get(tid('backlogModeTrashedStories')).click();
  cy.get(tid('backlog', 'restoreStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (1)');
  cy.get(tid('backlog')).contains('Trash (0)');

  cy.get(tid('backlogModeActiveStories')).click();

  // trash again and delete
  cy.get(tid('trashStoryButton')).click();

  cy.get(tid('backlogModeTrashedStories')).click();
  cy.get(tid('backlog', 'deleteStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (0)');
  cy.get(tid('backlog')).contains('Trash (0)');
});
