import {nanoid} from 'nanoid';
import socketIo from 'socket.io-client';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * just wraps given string value (or multiple values) as "attribute-selector" with attribute data-testid
 *
 * e.g.   tid('super-element', 'child')  will result in a selector:    [data-testid="super-element"] [data-testid="child"]
 *
 * @param tid
 * @return {string}
 */
export const tid = (...tid) => tid.map((t) => `[data-testid="${t}"]`).join(' ');

Cypress.Commands.add('openNewSocket', (socketIdentifier) => {
  cy.window().then((w) => {
    if (!w.__POINZ_E2E__) {
      w.__POINZ_E2E__ = {};
    }

    w.__POINZ_E2E__[socketIdentifier] = socketIo();
  });
});

Cypress.Commands.add('sendCommands', (socketIdentifier, commands) => {
  cy.window().then((w) => {
    if (!w.__POINZ_E2E__) {
      throw new Error('Call cy.openNewSocket()  first');
    }
    if (!w.__POINZ_E2E__[socketIdentifier]) {
      throw new Error(`No socket with id ${socketIdentifier} opened!`);
    }

    commands.forEach((cmd) => {
      w.__POINZ_E2E__[socketIdentifier].emit('command', {
        ...cmd,
        id: nanoid()
      });
    });
  });
});
