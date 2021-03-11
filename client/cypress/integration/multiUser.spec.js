import {v4 as uuid} from 'uuid';
import {tid} from '../support/commands';
import {Room} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('users/sergio.json').then((data) => (this.sergio = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('multi user estimation', function () {
  const roomId = 'multi-user-e2e_' + uuid();

  cy.visit('/' + roomId);

  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('whoamiSimple'));

  // this will open an additional socket to the backend, so that we can add another user to the room
  // Cypress does not support multiple browsers!   see    https://docs.cypress.io/guides/references/trade-offs.html

  // see ../support/commands.js
  const userTwoSocket = uuid();
  const userTwoUserId = uuid();
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
  cy.get(tid('users')).find('[data-testid="user"]').should('have.length', 2);

  //  add an additional story
  Room.Backlog.StoryAddForm.titleField().type(this.stories[0].title);
  Room.Backlog.StoryAddForm.addButton().click();

  // our user estimates... nothing is auto-revealed, other user did not estimate so far
  cy.get(tid('estimationCard.5')).click();

  //  and I can change my mind...   several times ;)
  cy.get(tid('estimationCard.5')).click();
  cy.get(tid('estimationCard.13')).click();
  cy.get(tid('estimationCard.8')).click();

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
      cy.get(tid('users')).contains(3);
      cy.get(tid('users')).contains(8);

      // let's try again
      cy.get(tid('newRoundButton')).click();

      cy.get(tid('estimationCard.8')).click();

      cy.sendCommands(userTwoSocket, [
        {
          roomId,
          name: 'giveStoryEstimate',
          userId: userTwoUserId,
          payload: {
            value: 8,
            storyId
          }
        }
      ]);

      cy.get(tid('users')).contains(8);
      cy.get(tid('estimationArea', 'cardValueBadge')).contains(8);

      cy.get(tid('nextStoryButton')).click();

      cy.get(tid('estimationArea', 'story')).contains(this.stories[0].title);
    });
});
