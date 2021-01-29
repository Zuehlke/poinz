import {tid} from '../support/commands';
import {Room, Landing} from '../elements/elements';

const {Backlog} = Room;

beforeEach(function () {
  cy.fixture('users/default.json').then((data) => (this.user = data));
  cy.fixture('stories.json').then((data) => (this.stories = data));
});

it('join new room, add a story with a title and description, modify it', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  Backlog.StoryAddForm.titleField().type(this.stories[0].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[0].description);
  Backlog.StoryAddForm.addButton().click();

  // add a second story, the first one remains selected...
  Backlog.StoryAddForm.titleField().type(this.stories[2].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[2].description);
  Backlog.StoryAddForm.addButton().click();

  Backlog.modeButtons().contains('Backlog (2)');
  Backlog.activeStoriesList().should('have.length', 2);
  Backlog.modeButtons().contains('Trash (0)');

  Backlog.SelectedStory.title().contains(this.stories[0].title);
  Backlog.SelectedStory.description().contains('..onthenextline');
  Backlog.SelectedStory.description().find('a'); // jira url in description is correctly rendered as link ( <a ...> tag)

  Backlog.SelectedStory.editButton().click();
  Backlog.SelectedStory.titleField().type(this.stories[3].title);
  Backlog.SelectedStory.descriptionField().clear().type(this.stories[3].description);

  Backlog.SelectedStory.saveChangesButton().click();

  // changes are saved
  Backlog.SelectedStory.title().contains(this.stories[3].title);
  Backlog.SelectedStory.description().contains(this.stories[3].description);
});

it('join new room, add a story trash it, restore it, trash it again and delete it', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  // add a story
  Backlog.StoryAddForm.titleField().type(this.stories[0].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[0].description);
  Backlog.StoryAddForm.addButton().click();

  Backlog.SelectedStory.title().contains(this.stories[0].title);

  Backlog.modeButtons().contains('Backlog (1)');
  Backlog.activeStoriesList().should('have.length', 1);
  Backlog.modeButtons().contains('Trash (0)');
  Backlog.trashedStoriesContainer().should('not.exist');

  // trash it
  Backlog.firstStoryTrashButton().click();

  Backlog.modeButtons().contains('Backlog (0)');
  Backlog.activeStoriesContainer().should('not.exist');
  Backlog.modeButtons().contains('Trash (1)');

  // switch to the trash (list of trashed stories)
  Backlog.modeButtonTrashedStories().click();
  Backlog.trashedStoriesList().should('have.length', 1);
  Backlog.trashedStoriesContainer().contains(this.stories[0].title);

  // restore it
  Backlog.firstTrashedStoryRestoreButton().click();

  Backlog.modeButtons().contains('Backlog (1)');
  Backlog.modeButtons().contains('Trash (0)');

  // switch to active stories, our restored story is selected
  Backlog.modeButtonActiveStories().click();
  Backlog.activeStoriesList().should('have.length', 1);
  Backlog.SelectedStory.title().contains(this.stories[0].title);

  // trash again and delete
  Backlog.firstStoryTrashButton().click();

  Backlog.modeButtonTrashedStories().click();
  cy.get(tid('backlog', 'deleteStoryButton')).click();

  Backlog.modeButtons().contains('Backlog (0)');
  Backlog.activeStoriesContainer().should('not.exist');
  Backlog.modeButtons().contains('Trash (0)');

  Backlog.modeButtonActiveStories().click();
});

it('join new room, add multiple stories sort and filter them', function () {
  cy.visit('/');

  Landing.joinButton().click();
  Landing.usernameField().type(this.user.username);
  Landing.joinButton().click();

  // add two stories
  Backlog.StoryAddForm.titleField().type(this.stories[0].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[0].description);
  Backlog.StoryAddForm.addButton().click();

  Backlog.StoryAddForm.titleField().type(this.stories[2].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[2].description);
  Backlog.StoryAddForm.addButton().click();

  // filter field now visible
  Backlog.filterQueryField().click();

  // add a third story
  Backlog.StoryAddForm.titleField().type(this.stories[3].title);
  Backlog.StoryAddForm.descriptionField().type(this.stories[3].description);
  Backlog.StoryAddForm.addButton().click();

  // search for a story
  Backlog.filterQueryField().type(this.stories[2].title.substring(0, 5));

  Backlog.activeStoriesList().should('have.length', 1); // only one story matches
  Backlog.activeStoriesList().eq(0).find('h4').contains(this.stories[2].title); // the title of the second story

  Backlog.filterQueryField().clear();

  // all three stories visible again, after filter field cleared
  Backlog.activeStoriesList().should('have.length', 3); // only one story matches

  // open sort dropdown and click different sortings
  Backlog.sortButton().click();
  Backlog.sortOptionsList().should('have.length', 4);
  Backlog.sortOptionsList().eq(1).click(); // "Oldest" = first added story on top
  Backlog.activeStoriesList().eq(0).find('h4').contains(this.stories[0].title);
  Backlog.activeStoriesList().eq(1).find('h4').contains(this.stories[2].title);
  Backlog.activeStoriesList().eq(2).find('h4').contains(this.stories[3].title);

  Backlog.sortButton().click();
  Backlog.sortOptionsList().eq(2).click(); // "Title A-Z"
  Backlog.activeStoriesList().eq(0).find('h4').contains(this.stories[0].title);
  Backlog.activeStoriesList().eq(1).find('h4').contains(this.stories[3].title);
  Backlog.activeStoriesList().eq(2).find('h4').contains(this.stories[2].title);

  Backlog.sortButton().click();
  Backlog.sortOptionsList().eq(0).click(); // "Newest" (default, last added story on top)
  Backlog.activeStoriesList().eq(0).find('h4').contains(this.stories[3].title);
  Backlog.activeStoriesList().eq(1).find('h4').contains(this.stories[2].title);
  Backlog.activeStoriesList().eq(2).find('h4').contains(this.stories[0].title);
});
