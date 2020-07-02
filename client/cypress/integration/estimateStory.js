
it('join new room, add a story, estimate the story (alone)', () => {
  cy.visit('/');
  cy.getTID('joinButton').click();
  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('storyAddForm', 'input[type="text"]').type('My First Test Story');
  cy.getTID('storyAddForm', 'textarea').type('A Nice description:  http://test.jira.com/ISSUE-123');
  cy.getTID('storyAddForm', 'button').click();

  cy.getTID('estimationCard.13').click();

  cy.getTID('user').contains('13');
});
