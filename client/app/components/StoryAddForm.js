import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addStory} from '../actions';
import {hasMatchingPendingCommand} from '../services/queryPendingCommands';
import {StyledAddForm} from '../styled/Backlog';
import ValidatedInput from './ValidatedInput';
import ValidatedTextarea from './ValidatedTextarea';

const REGEX_STORY_TITLE = /^.{1,100}$/;
const REGEX_STORY_DESCR = /^.{1,2000}$/;

/**
 * Form for adding stories to the backlog
 */
const StoryAddForm = ({t, addStory, hasPendingAddCommands}) => {
  const waiting = hasPendingAddCommands;

  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescr, setStoryDescr] = useState('');

  return (
    <StyledAddForm
      data-testid="storyAddForm"
      className={`pure-form ${waiting ? 'waiting-spinner' : ''}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset className="pure-group">
        <ValidatedInput
          type="text"
          className="pure-input-1"
          placeholder={t('storyTitle')}
          fieldValue={storyTitle}
          setFieldValue={setStoryTitle}
          regexPattern={REGEX_STORY_TITLE}
          onEnter={triggerAddAndClearForm}
        />

        <ValidatedTextarea
          className="pure-input-1"
          rows="1"
          placeholder={t('description')}
          fieldValue={storyDescr}
          setFieldValue={setStoryDescr}
          regexPattern={REGEX_STORY_DESCR}
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

  function triggerAddAndClearForm() {
    if (storyTitle) {
      addStory(storyTitle, storyDescr);
      setStoryTitle('');
      setStoryDescr('');
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
