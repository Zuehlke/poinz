import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addStory} from '../actions';
import {hasMatchingPendingCommand} from '../services/queryPendingCommands';
import {StyledAddForm} from '../styled/Backlog';

/**
 * Form for adding stories to the backlog
 */
const StoryAddForm = ({t, addStory, hasPendingAddCommands}) => {
  const waiting = hasPendingAddCommands;
  let titleInputField, descriptionInputField;

  return (
    <StyledAddForm
      className={`pure-form ${waiting ? 'waiting-spinner' : ''}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className="pure-group">
        <input
          type="text"
          className="pure-input-1"
          placeholder={t('storyTitle')}
          ref={(ref) => (titleInputField = ref)}
          onKeyPress={handleTitleKeyEvent}
        />

        <textarea
          className="pure-input-1"
          rows="1"
          placeholder={t('description')}
          ref={(ref) => (descriptionInputField = ref)}
        />
      </fieldset>

      <button
        type="button"
        className="pure-button pure-input-1 pure-button-primary"
        onClick={triggerAddAndClearForm}
      >
        {t('addStory')}
        <i className="fa fa-plus  button-icon-right"></i>
      </button>
    </StyledAddForm>
  );

  function handleTitleKeyEvent(keyEvent) {
    if (keyEvent.key === 'Enter') {
      triggerAddAndClearForm();
    }
  }

  function triggerAddAndClearForm() {
    if (titleInputField.value) {
      addStory(titleInputField.value, descriptionInputField.value);
      titleInputField.value = '';
      descriptionInputField.value = '';
    }
  }
};

StoryAddForm.propTypes = {
  t: PropTypes.func,
  addStory: PropTypes.func,
  hasPendingAddCommands: PropTypes.bool
};

export default connect(
  (state) => ({
    t: state.translator,
    hasPendingAddCommands: hasMatchingPendingCommand(state, 'addStory')
  }),
  {addStory}
)(StoryAddForm);
