import {tid} from '../support/commands';

/**
 *  This file specifies selectors for elements in the PoinZ UI.
 *
 *  The root Object ist structured into Views -> Components. (Uppercase)
 *  All functions (lowercase) must return/yield Cypress Elements (.get  .find  .first  .children )
 *
 *  No interactions ( .click / .type), no assertions. We don't want to have too much abstraction.
 *  Interactions with elements should be clearly visible within the test.
 *
 */
const elements = {
  Landing: {
    joinButton: () => cy.get(tid('joinButton')),
    usernameField: () => cy.get(tid('usernameInput')),

    extendButton: () => cy.get(tid('extendButton')),
    customRoomNameField: () => cy.get(tid('customRoomNameInput'))
  },

  Room: {
    matrixToggle: () => cy.get(tid('board', 'matrixToggle')),
    estimationMatrix: () => cy.get(tid('board', 'matrix')),

    TopBar: {
      logo: () => cy.get(tid('topBar', 'logo')),
      whoami: () => cy.get(tid('topBar', 'whoami')),
      whoamiDropdown: () => cy.get(tid('topBar', 'whoami', 'whoamiDropdown')),
      settingsToggleButton: () => cy.get(tid('topBar', 'settingsToggle'))
    },

    EstimationArea: {
      estimationCard: (cardValue) => cy.get(tid(`estimationCard.${cardValue}`)),
      storyConsensus: () => cy.get(tid('estimationArea', 'story', 'cardValueBadge')),
      markdownToggleButton: () => cy.get(tid('estimationArea', 'story', 'markdownToggleButton')),
      storyDescription: () => cy.get(tid('estimationArea', 'story', 'storyText')),
      newRoundButton: () => cy.get(tid('estimationArea', 'newRoundButton')),
      summaryCard: (cardValue) => cy.get(tid(`summaryCard.${cardValue}`))
    },

    Users: {
      usersContainer: () => cy.get(tid('users')),
      usersList: () => cy.get(tid('users')).children(),
      userEstimationGiven: (cardValue) => cy.get(tid('users', `userEstimationGiven.${cardValue}`)),
      userEstimationGivenRevealed: (cardValue) =>
        cy.get(tid('users', `revealed.userEstimationGiven.${cardValue}`))
    },

    Settings: {
      settingsContainer: () => cy.get(tid('settings')),
      usernameField: () => cy.get(tid('settings', 'usernameInput')),
      saveUsernameButton: () => cy.get(tid('settings', 'saveUsernameButton')),
      roomPasswordField: () => cy.get(tid('settings', 'roomPasswordInput'))
    },

    Backlog: {
      modeButtons: () => cy.get(tid('backlog') + ' > .pure-g'),
      modeButtonActiveStories: () => cy.get(tid('backlog', 'backlogModeActiveStories')),
      modeButtonTrashedStories: () => cy.get(tid('backlog', 'backlogModeTrashedStories')),

      StoryAddForm: {
        titleField: () => cy.get(tid('storyAddForm') + ' input[type="text"]'),
        descriptionField: () => cy.get(tid('storyAddForm') + ' textarea'),
        addButton: () => cy.get(tid('storyAddForm') + ' button')
      },

      filterQueryField: () => cy.get(tid('backlog', 'filterQueryInput')),
      sortButton: () => cy.get(tid('backlog', 'sortButton')),
      sortOptionsList: () => cy.get(tid('backlog', 'sortOptions')).children(),

      activeStoriesContainer: () => cy.get(tid('activeStories')),
      activeStoriesList: () => cy.get(tid('activeStories')).children(),
      firstStoryTrashButton: () =>
        cy.get(tid('activeStories')).children().eq(0).find(tid('trashStoryButton')),

      trashedStoriesContainer: () => cy.get(tid('trashedStories')),
      trashedStoriesList: () => cy.get(tid('trashedStories')).children(),
      firstTrashedStoryRestoreButton: () =>
        cy.get(tid('trashedStories')).first().find(tid('restoreStoryButton')),

      activeWaitingStories: () => cy.get(tid('activeStories') + ' .waiting-spinner'),

      SelectedStory: {
        title: () => cy.get(tid('backlog', 'storySelected') + ' h4'),
        description: () => cy.get(tid('backlog', 'storySelected', 'storyText')),
        editButton: () => cy.get(tid('backlog', 'storySelected', 'editStoryButton')),
        titleField: () => cy.get(tid('backlog', 'storySelected') + ' input[type="text"]'),
        descriptionField: () => cy.get(tid('backlog', 'storySelected') + ' textarea'),
        saveChangesButton: () => cy.get(tid('backlog', 'storySelected', 'saveStoryChangesButton'))
      }
    }
  }
};

export default elements;
