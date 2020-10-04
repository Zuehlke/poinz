import {tid} from '../support/commands';

it('visit appStatus page', function () {
  // smoke test, that just checks whether the status page is served
  cy.visit('/poinzstatus');
  cy.get(tid('appStatusPage'));
});
