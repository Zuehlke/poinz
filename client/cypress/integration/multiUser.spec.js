import {nanoid} from 'nanoid';
import {tid} from '../support/commands';
import {Landing, Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('multi user estimation with two rounds, consensus on second round', function () {
  const roomId = 'multi-user-e2e_' + nanoid().toLowerCase();

  cy.visit('/' + roomId);

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();
  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);

  // -- the following will open an additional socket to the backend, so that we can add another user to the room
  // Cypress does not support multiple browsers!   see    https://docs.cypress.io/guides/references/trade-offs.html
  // see ../support/commands.js
  const userTwoSocket = nanoid();
  const userTwoUserId = nanoid().toLowerCase();
  cy.openNewSocket(userTwoSocket);
  cy.sendCommands(userTwoSocket, [
    {
      roomId,
      name: 'joinRoom',
      userId: userTwoUserId,
      payload: {
        username: this.sergio.username,
        avatar: 3
      }
    }
  ]);

  // now we have two users in the room and can do a real estimation round :)
  Room.Users.usersList().should('have.length', 2);

  //  add an additional story
  Room.Backlog.StoryAddForm.titleField().type(this.stories[0].title);
  Room.Backlog.StoryAddForm.addButton().click();

  // our user estimates... nothing is auto-revealed, other user did not estimate so far
  Room.EstimationArea.estimationCard(5).click();
  Room.Users.userEstimationGiven(5); // my user displays my card as "value given" (without showing the actual value)

  //  and I can change my mind...   several times ;)
  Room.EstimationArea.estimationCard(5).click(); // clearEstimation
  Room.EstimationArea.estimationCard(13).click();
  Room.EstimationArea.estimationCard(8).click();

  // get the story id from the selected story node in the DOM
  // this is still the sample story ("Welcome")
  cy.get(tid('storySelected'))
    .should('have.attr', 'id')
    .then((theStoryElementId) => {
      const storyId = theStoryElementId.substring(theStoryElementId.lastIndexOf('.') + 1);

      // let the other user estimate
      cy.sendCommands(userTwoSocket, [
        {
          roomId,
          name: 'giveStoryEstimate',
          userId: userTwoUserId,
          payload: {
            value: 3,
            storyId
          }
        }
      ]);

      // auto revealed, but no consensus
      Room.Users.userEstimationGivenRevealed(3);
      Room.Users.userEstimationGivenRevealed(8);

      // let's try again in a new round
      Room.EstimationArea.newRoundButton().click();

      // first users selects 8
      Room.EstimationArea.estimationCard(8).click();

      cy.sendCommands(userTwoSocket, [
        {
          roomId,
          name: 'giveStoryEstimate',
          userId: userTwoUserId,
          payload: {
            value: 8, // second user selects also 8
            storyId
          }
        }
      ]);

      Room.Users.userEstimationGivenRevealed(8);
      Room.EstimationArea.storyConsensus().contains('8');

      cy.get(tid('nextStoryButton')).click();
      cy.get(tid('estimationArea', 'story')).contains(this.stories[0].title);
    });
});

it('estimation summary and settling on a value', function () {
  const roomId = 'multi-user-e2e_' + nanoid().toLowerCase();

  cy.visit('/' + roomId);

  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();
  Room.TopBar.whoami().click();
  Room.TopBar.whoamiDropdown().contains(this.user.username);

  const userTwoSocket = nanoid();
  const userTwoUserId = nanoid().toLowerCase();
  cy.openNewSocket(userTwoSocket);
  cy.sendCommands(userTwoSocket, [
    {
      roomId,
      name: 'joinRoom',
      userId: userTwoUserId,
      payload: {
        username: this.sergio.username,
        avatar: 3
      }
    }
  ]);

  Room.Users.usersList().should('have.length', 2); // important to "wait" for second user to show up in users list

  Room.EstimationArea.estimationCard(5).click();

  cy.get(tid('storySelected'))
    .should('have.attr', 'id')
    .then((theStoryElementId) => {
      const storyId = theStoryElementId.substring(theStoryElementId.lastIndexOf('.') + 1);

      // let the other user estimate
      cy.sendCommands(userTwoSocket, [
        {
          roomId,
          name: 'giveStoryEstimate',
          userId: userTwoUserId,
          payload: {
            value: 3,
            storyId
          }
        }
      ]);

      // auto revealed, but no consensus
      Room.Users.userEstimationGivenRevealed(3);
      Room.Users.userEstimationGivenRevealed(5);

      cy.get(tid('estimationSummary')).contains('2 of 2 Users estimated');
      cy.get(tid('estimationSummary')).contains('Numerical average is 4');

      // user one (e.g. the scrum master) settles on "3"
      Room.EstimationArea.summaryCard(3).click();

      cy.get(tid('estimationSummary')).contains('Manually settled on');
      Room.EstimationArea.storyConsensus().contains('3');
      Room.Users.userEstimationGivenRevealed(3);
      Room.Users.userEstimationGivenRevealed(5);
    });
});
