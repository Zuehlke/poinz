import {customNanoid} from '../support/commands';
import path from 'path';

import {Room, Landing} from '../elements/elements';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('setup stories in new room and export them (download json)', function () {
  const customRoomName = 'e2e-room-' + customNanoid();

  cy.visit('/');
  Landing.extendButton().click();
  Landing.customRoomNameField().type(customRoomName);
  Landing.joinButton().click();

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Room.Backlog.StoryAddForm.titleField().type(this.stories[3].title);
  Room.Backlog.StoryAddForm.descriptionField().type(this.stories[3].description);
  Room.Backlog.StoryAddForm.addButton().click();

  Room.EstimationArea.estimationCard(21).click();
  Room.Users.userEstimationGiven(21, true); // since auto reveal is on by default. and we are one single user in the room

  // now go to room settings and click "Download"
  Room.TopBar.settingsToggleButton().click();
  Room.Settings.storiesExportButton().click();

  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(downloadsFolder, `${customRoomName.toLowerCase()}.json`);
  cy.readFile(downloadedFilename); // will fail if file does not exist!
});
