import {tid} from '../support/commands';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('join new room, add a story, estimate the story (alone)', function () {
  cy.visit('/');
  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('storyAddForm') + ' input[type="text"]').type(this.stories[3].title);
  cy.get(tid('storyAddForm') + ' textarea').type(this.stories[3].description);
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('estimationCard.13')).click();

  cy.get(tid('user')).contains('13');

  cy.get(tid('estimationArea', 'story')).contains('13'); // auto-revealed and showing consensus (since we have only one user in the room)
  cy.get(tid('estimationArea', 'newRoundButton')); // revealed / round done -> "new Round" button is shown
});
