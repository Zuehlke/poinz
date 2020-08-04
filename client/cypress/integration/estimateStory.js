import {tid} from '../support/commands';

it('join new room, add a story, estimate the story (alone)', () => {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type('e2e-cypress-test-user');
  cy.get(tid('joinButton')).click();

  cy.get(tid('storyAddForm') + ' input[type="text"]').type('My First Test Story');
  cy.get(tid('storyAddForm') + ' textarea').type(
    'A Nice description:  http://test.jira.com/ISSUE-123'
  );
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('estimationCard.13')).click();

  cy.get(tid('user')).contains('13');
});
