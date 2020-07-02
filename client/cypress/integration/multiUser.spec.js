import {v4 as uuid} from 'uuid';

it('multi user estimation', () => {
  const roomId = 'multi-user-e2e_' + uuid();

  cy.visit('/' + roomId);

  cy.getTID('usernameInput').type('e2e-cypress-test-user');
  cy.getTID('joinButton').click();

  cy.getTID('whoamiSimple');

  // this will open an additional socket to the backend, so that we can add another user to the room
  // Cypress does not support multiple browsers!   see    https://docs.cypress.io/guides/references/trade-offs.html
  const userTwoSocket = uuid();
  cy.openNewSocket(userTwoSocket);

  cy.sendCommands(userTwoSocket, [
    {
      roomId,
      name: 'joinRoom',
      payload: {
        username: 'theOtherOne',
        avatar: 3
      }
    }
  ]);

  // now we have two users in the room and can do a real estimation round :)

  cy.getTID('storyAddForm', 'input[type="text"]').type('A fake story');
  cy.getTID('storyAddForm', 'button').click();

  cy.getTID('estimationCard.5').click();
  // only we estimated.. nothing is revealed

  //  and I can change my mind..
  cy.getTID('estimationCard.5').click();

  cy.getTID('estimationCard.13').click();

  // several times ;)
  cy.getTID('estimationCard.8').click();

  // get the story id from the selected story node in the DOM
  cy.getTID('storySelected')
    .should('have.attr', 'id')
    .then((theStoryElementId) => {
      const storyId = theStoryElementId.substring(theStoryElementId.lastIndexOf('.') + 1);

      // let the other user estimate
      cy.sendCommands(userTwoSocket, [
        {
          roomId,
          name: 'giveStoryEstimate',
          payload: {
            storyId,
            value: 3
          }
        }
      ]);
    });
});
