import {Room, Landing} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('join new room, add a story, estimate the story (alone)', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.Backlog.StoryAddForm.titleField().type(this.stories[3].title);
  Room.Backlog.StoryAddForm.descriptionField().type(this.stories[3].description);
  Room.Backlog.StoryAddForm.addButton().click();

  Room.EstimationArea.estimationCard(13).click();

  Room.Users.userEstimationGiven(13);

  Room.EstimationArea.storyConsensus().contains('13'); // auto-revealed and showing consensus (since we have only one user in the room)
  Room.EstimationArea.newRoundButton().click(); // revealed  -> "new Round" button is shown
});
