import socketIo from 'socket.io-client';
import {v4 as uuid} from 'uuid';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

export const asTid = (tid) => `[data-testid="${tid}"]`;

Cypress.Commands.add('getTID', (tid, moreSelectors) => {
  return cy.get(`${asTid(tid)}${moreSelectors ? ' ' + moreSelectors : ''}`);
});

Cypress.Commands.add('openNewSocket', (socketIdentifier) => {
  cy.window().then((w) => {
    if (!w.__POINZ_E2E__) {
      w.__POINZ_E2E__ = {};
    }

    w.__POINZ_E2E__[socketIdentifier] = socketIo('http://localhost:3000');
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
        id: uuid()
      });
    });
  });
});
