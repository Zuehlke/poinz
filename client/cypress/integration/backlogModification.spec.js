import {tid} from '../support/commands';

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('join new room, add a story with a title and description, modify it', function () {
  cy.visit('/');

  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  cy.get(tid('storyAddForm') + ' input[type="text"]').type(this.stories[0].title);
  cy.get(tid('storyAddForm') + ' textarea').type(this.stories[0].description);
  cy.get(tid('storyAddForm') + ' button').click();

  // add a second story, the first one remains selected...
  cy.get(tid('storyAddForm') + ' input[type="text"]').type(this.stories[2].title);
  cy.get(tid('storyAddForm') + ' textarea').type(this.stories[2].description);
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('backlog')).contains('Backlog (2)');
  cy.get(tid('backlog')).contains('Trash (0)');

  cy.get(tid('storySelected') + ' h4').contains(this.stories[0].title);
  cy.get(tid('storySelected', 'storyText')).contains('..onthenextline');
  cy.get(tid('storySelected', 'storyText') + ' a'); // jira url in description is correctly rendered as link ( <a ...> tag)

  cy.get(tid('storySelected', 'editStoryButton')).click();
  cy.get(tid('storySelected') + ' input[type="text"]').type(this.stories[3].title);
  cy.get(tid('storySelected') + ' textarea')
    .clear()
    .type(this.stories[3].description);
  cy.get(tid('storySelected', 'saveStoryChangesButton')).click();

  // changes are saved
  cy.get(tid('storySelected') + ' h4').contains(this.stories[3].title);
  cy.get(tid('storySelected', 'storyText')).contains(this.stories[3].description);
});

it('join new room, add a story trash it, restore it, trash it again and delete it', function () {
  cy.visit('/');

  cy.get(tid('joinButton')).click();
  cy.get(tid('usernameInput')).type(this.user.username);
  cy.get(tid('joinButton')).click();

  // add a story
  cy.get(tid('storyAddForm') + ' input[type="text"]').type(this.stories[0].title);
  cy.get(tid('storyAddForm') + ' textarea').type(this.stories[0].description);
  cy.get(tid('storyAddForm') + ' button').click();

  cy.get(tid('storySelected') + ' h4').contains(this.stories[0].title);

  cy.get(tid('backlog')).contains('Backlog (1)');
  cy.get(tid('backlog')).contains('Trash (0)');

  // trash it
  cy.get(tid('trashStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (0)');
  cy.get(tid('backlog')).contains('Trash (1)');

  // switch to the trash (list of trashed stories)
  cy.get(tid('backlogModeTrashedStories')).click();
  cy.get(tid('backlog')).contains(this.stories[0].title);

  // restore it
  cy.get(tid('backlog', 'restoreStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (1)');
  cy.get(tid('backlog')).contains('Trash (0)');

  // switch to active stories, our restored story is selected
  cy.get(tid('backlogModeActiveStories')).click();
  cy.get(tid('storySelected') + ' h4').contains(this.stories[0].title);

  // trash again and delete
  cy.get(tid('trashStoryButton')).click();

  cy.get(tid('backlogModeTrashedStories')).click();
  cy.get(tid('backlog', 'deleteStoryButton')).click();

  cy.get(tid('backlog')).contains('Backlog (0)');
  cy.get(tid('backlog')).contains('Trash (0)');

  cy.get(tid('backlogModeActiveStories')).click();
});
